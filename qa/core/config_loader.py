"""Load and normalize test cases from YAML configuration."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Set

import yaml

from .models import TestCase


def load_test_cases(config_path: str, selected_tags: Optional[Sequence[str]] = None) -> List[TestCase]:
    """Load and optionally filter test cases from YAML file."""
    path = Path(config_path)
    if not path.exists():
        raise FileNotFoundError(f"Test config file does not exist: {config_path}")

    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle) or {}

    raw_cases = data.get("test_cases", [])
    if not isinstance(raw_cases, list):
        raise ValueError("Invalid test config format: 'test_cases' must be a list.")

    tag_filter = _normalize_tags(selected_tags)
    loaded: List[TestCase] = []
    for idx, raw_case in enumerate(raw_cases):
        if not isinstance(raw_case, dict):
            raise ValueError(f"Invalid test case at index {idx}: expected a mapping.")
        test_case = _to_test_case(raw_case)
        if tag_filter and not (set(test_case.tags) & tag_filter):
            continue
        loaded.append(test_case)

    return loaded


def _to_test_case(raw_case: Dict[str, Any]) -> TestCase:
    name = _as_str(raw_case.get("name"), "name")
    method = _as_str(raw_case.get("method"), "method").upper()
    path = _as_str(raw_case.get("path"), "path")
    description = str(raw_case.get("description", ""))

    expected_status = _normalize_status_codes(raw_case.get("expected_status", [200]))

    return TestCase(
        name=name,
        method=method,
        path=path,
        description=description,
        tags=_normalize_string_list(raw_case.get("tags", [])),
        headers=_normalize_string_map(raw_case.get("headers", {})),
        query_params=_normalize_dict(raw_case.get("query_params", {})),
        body=raw_case.get("body"),
        raw_body=raw_case.get("raw_body"),
        expected_status=expected_status,
        expected_schema=_normalize_string_map(raw_case.get("expected_schema", {})),
        expected_values=_normalize_dict(raw_case.get("expected_values", {})),
        required_non_null_fields=_normalize_string_list(
            raw_case.get("required_non_null_fields", [])
        ),
        required_non_empty_fields=_normalize_string_list(
            raw_case.get("required_non_empty_fields", [])
        ),
        required_when_success_fields=_normalize_string_list(
            raw_case.get("required_when_success_fields", [])
        ),
        allow_empty_array_fields=_normalize_string_list(
            raw_case.get("allow_empty_array_fields", [])
        ),
        max_response_time_ms=_normalize_optional_int(raw_case.get("max_response_time_ms")),
        follow_redirects=_normalize_bool(raw_case.get("follow_redirects", True)),
    )


def _as_str(value: Any, field_name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"Invalid test case field '{field_name}': expected non-empty string.")
    return value.strip()


def _normalize_tags(tags: Optional[Sequence[str]]) -> Set[str]:
    if not tags:
        return set()
    return {str(tag).strip() for tag in tags if str(tag).strip()}


def _normalize_status_codes(value: Any) -> List[int]:
    if isinstance(value, int):
        return [value]
    if isinstance(value, list):
        normalized: List[int] = []
        for item in value:
            if not isinstance(item, int):
                raise ValueError("expected_status must contain integers only.")
            normalized.append(item)
        if not normalized:
            raise ValueError("expected_status cannot be empty.")
        return normalized
    raise ValueError("expected_status must be an integer or list of integers.")


def _normalize_string_list(value: Any) -> List[str]:
    if value is None:
        return []
    if not isinstance(value, list):
        raise ValueError("Expected list value.")
    out: List[str] = []
    for item in value:
        text = str(item).strip()
        if text:
            out.append(text)
    return out


def _normalize_string_map(value: Any) -> Dict[str, str]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise ValueError("Expected mapping value.")
    return {str(k): str(v) for k, v in value.items()}


def _normalize_dict(value: Any) -> Dict[str, Any]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise ValueError("Expected mapping value.")
    return value


def _normalize_optional_int(value: Any) -> Optional[int]:
    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.strip().isdigit():
        return int(value.strip())
    raise ValueError("Expected integer value.")


def _normalize_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        lowered = value.strip().lower()
        if lowered in {"true", "1", "yes"}:
            return True
        if lowered in {"false", "0", "no"}:
            return False
    raise ValueError("Expected boolean value.")
