"""Validation rules for API responses."""

from __future__ import annotations

from typing import Any, Optional, Tuple

from .models import TestResult


class ResponseValidator:
    """Applies status, schema, and consistency checks."""

    def __init__(self, slow_response_threshold_ms: int = 2000) -> None:
        self.slow_response_threshold_ms = slow_response_threshold_ms

    def validate(self, result: TestResult) -> TestResult:
        """Run all checks and append issues to the result."""
        self._validate_status(result)
        self._validate_json_shape(result)
        self._validate_expected_values(result)
        self._validate_required_fields(result)
        self._validate_response_time(result)
        self._validate_logical_consistency(result)
        return result

    def _validate_status(self, result: TestResult) -> None:
        expected = result.test_case.expected_status
        actual = result.actual_status

        if result.network_error:
            result.add_issue(
                severity="error",
                category="network",
                message=f"Request failed: {result.network_error}",
            )
            return

        if actual is None:
            result.add_issue(
                severity="error",
                category="status",
                message="No HTTP status code was captured.",
            )
            return

        if actual not in expected:
            result.add_issue(
                severity="error",
                category="status",
                message=f"Unexpected status code: got {actual}, expected one of {expected}.",
            )

        if 400 <= actual < 500:
            result.add_issue(
                severity="warning",
                category="http",
                message=f"Client-side error response detected: {actual}.",
            )
        elif actual >= 500:
            result.add_issue(
                severity="error",
                category="http",
                message=f"Server-side error response detected: {actual}.",
            )

    def _validate_json_shape(self, result: TestResult) -> None:
        schema = result.test_case.expected_schema
        if not schema:
            return

        if result.network_error:
            return

        payload = result.response_json
        if payload is None:
            result.add_issue(
                severity="error",
                category="schema",
                message="Expected JSON response body but received non-JSON or invalid JSON.",
            )
            return

        for path, expected_type in schema.items():
            exists, value = self._resolve_path(payload, path)
            if not exists:
                result.add_issue(
                    severity="error",
                    category="schema",
                    message=f"Missing expected field: {path}",
                    field=path,
                )
                continue

            if not self._matches_type(value, expected_type):
                actual_type = type(value).__name__
                result.add_issue(
                    severity="error",
                    category="schema",
                    message=(
                        f"Type mismatch for field '{path}': "
                        f"expected {expected_type}, got {actual_type}."
                    ),
                    field=path,
                )

    def _validate_required_fields(self, result: TestResult) -> None:
        payload = result.response_json
        if payload is None:
            return

        for path in result.test_case.required_non_null_fields:
            exists, value = self._resolve_path(payload, path)
            if not exists:
                result.add_issue(
                    severity="error",
                    category="required_field",
                    message=f"Required field missing: {path}",
                    field=path,
                )
                continue
            if value is None:
                result.add_issue(
                    severity="error",
                    category="required_field",
                    message=f"Required field is null: {path}",
                    field=path,
                )

        for path in result.test_case.required_non_empty_fields:
            exists, value = self._resolve_path(payload, path)
            if not exists:
                result.add_issue(
                    severity="error",
                    category="required_field",
                    message=f"Required non-empty field missing: {path}",
                    field=path,
                )
                continue
            if self._is_empty(value):
                result.add_issue(
                    severity="error",
                    category="required_field",
                    message=f"Required field is empty: {path}",
                    field=path,
                )

        if result.actual_status is not None and 200 <= result.actual_status < 300:
            for path in result.test_case.required_when_success_fields:
                exists, value = self._resolve_path(payload, path)
                if not exists:
                    result.add_issue(
                        severity="error",
                        category="consistency",
                        message=f"Success response is missing required data field: {path}",
                        field=path,
                    )
                    continue
                if value is None or self._is_empty(value):
                    result.add_issue(
                        severity="error",
                        category="consistency",
                        message=f"Success response has empty required data field: {path}",
                        field=path,
                    )

    def _validate_expected_values(self, result: TestResult) -> None:
        payload = result.response_json
        expected_values = result.test_case.expected_values
        if payload is None or not expected_values:
            return

        for path, expected_value in expected_values.items():
            exists, actual_value = self._resolve_path(payload, path)
            if not exists:
                result.add_issue(
                    severity="error",
                    category="value",
                    message=f"Missing expected field for value assertion: {path}",
                    field=path,
                )
                continue

            if actual_value != expected_value:
                result.add_issue(
                    severity="error",
                    category="value",
                    message=(
                        f"Unexpected value for '{path}': "
                        f"expected {expected_value!r}, got {actual_value!r}."
                    ),
                    field=path,
                )

    def _validate_response_time(self, result: TestResult) -> None:
        threshold = (
            result.test_case.max_response_time_ms
            if result.test_case.max_response_time_ms is not None
            else self.slow_response_threshold_ms
        )
        if result.response_time_ms > threshold:
            result.add_issue(
                severity="warning",
                category="performance",
                message=(
                    f"Slow response detected: {result.response_time_ms:.2f}ms "
                    f"(threshold {threshold}ms)."
                ),
            )

    def _validate_logical_consistency(self, result: TestResult) -> None:
        payload = result.response_json
        if payload is None:
            return

        # 2xx responses should generally not expose top-level "error".
        if result.actual_status is not None and 200 <= result.actual_status < 300:
            if isinstance(payload, dict) and "error" in payload:
                result.add_issue(
                    severity="warning",
                    category="consistency",
                    message="2xx response contains an 'error' field.",
                    field="error",
                )

        # Flag unexpected empty lists unless explicitly allowed by the test case.
        if isinstance(payload, dict):
            allowed = set(result.test_case.allow_empty_array_fields)
            for key, value in payload.items():
                if isinstance(value, list) and not value and key not in allowed:
                    result.add_issue(
                        severity="warning",
                        category="consistency",
                        message=f"Field '{key}' is an empty list.",
                        field=key,
                    )

    def _resolve_path(self, payload: Any, path: str) -> Tuple[bool, Any]:
        """
        Resolve a dotted path in a nested JSON-like payload.

        Supports indexes like `items[0].name`.
        """
        current = payload
        segments = path.split(".")

        for segment in segments:
            key, index = self._split_segment(segment)

            if key:
                if not isinstance(current, dict) or key not in current:
                    return False, None
                current = current[key]

            if index is not None:
                if not isinstance(current, list) or index >= len(current):
                    return False, None
                current = current[index]

        return True, current

    @staticmethod
    def _split_segment(segment: str) -> Tuple[str, Optional[int]]:
        if "[" not in segment or not segment.endswith("]"):
            return segment, None
        key = segment[: segment.index("[")]
        index_str = segment[segment.index("[") + 1 : -1]
        if not index_str.isdigit():
            return segment, None
        return key, int(index_str)

    @staticmethod
    def _is_empty(value: Any) -> bool:
        return value in ("", [], {}, ())

    def _matches_type(self, value: Any, expected_type: str) -> bool:
        type_map = {
            "str": str,
            "string": str,
            "int": int,
            "integer": int,
            "float": float,
            "number": (int, float),
            "bool": bool,
            "boolean": bool,
            "dict": dict,
            "object": dict,
            "list": list,
            "array": list,
            "null": type(None),
            "any": object,
        }
        expected = type_map.get(expected_type.lower())
        if expected is None:
            return True
        if expected is object:
            return True
        # bool is a subclass of int in Python; keep checks strict for int.
        if expected in (int, (int, float)) and isinstance(value, bool):
            return False
        return isinstance(value, expected)
