"""HTTP client utilities for executing API test cases."""

from __future__ import annotations

import json
import time
from typing import Any, Dict, Optional
from urllib.parse import urljoin

import requests

from .models import TestCase, TestResult


class ApiClient:
    """Executes HTTP requests with retry and timing support."""

    def __init__(
        self,
        base_url: str,
        timeout_seconds: float = 10.0,
        retries: int = 3,
        backoff_factor: float = 0.5,
    ) -> None:
        self.base_url = base_url.rstrip("/") + "/"
        self.timeout_seconds = timeout_seconds
        self.retries = max(0, retries)
        self.backoff_factor = max(0.0, backoff_factor)
        self.session = requests.Session()

    def close(self) -> None:
        """Close the underlying requests session."""
        self.session.close()

    def _build_url(self, path: str) -> str:
        clean_path = path.lstrip("/")
        return urljoin(self.base_url, clean_path)

    def run_test_case(self, test_case: TestCase) -> TestResult:
        """Execute one test case and return a populated result."""
        url = self._build_url(test_case.path)
        result = TestResult(test_case=test_case)
        result.request_url = url
        result.request_query_params = dict(test_case.query_params)
        result.request_headers = dict(test_case.headers)
        result.request_body = test_case.raw_body if test_case.raw_body is not None else test_case.body

        attempts = self.retries + 1
        for attempt in range(attempts):
            result.retries_used = attempt
            started = time.perf_counter()
            try:
                response = self._send_request(test_case, url)
                elapsed_ms = (time.perf_counter() - started) * 1000.0
                result.response_time_ms = elapsed_ms
                result.actual_status = response.status_code
                result.response_headers = dict(response.headers)
                result.response_text = response.text
                result.response_json = self._safe_parse_json(response)
                result.network_error = None

                if response.status_code >= 500 and attempt < self.retries:
                    self._sleep_backoff(attempt)
                    continue

                result.finalize()
                return result

            except requests.RequestException as exc:
                elapsed_ms = (time.perf_counter() - started) * 1000.0
                result.response_time_ms = elapsed_ms
                result.network_error = str(exc)
                if attempt < self.retries:
                    self._sleep_backoff(attempt)
                    continue

                result.finalize()
                return result

        result.finalize()
        return result

    def _send_request(self, test_case: TestCase, url: str) -> requests.Response:
        """Dispatch an HTTP request according to test case data."""
        method = test_case.method.upper()
        headers: Dict[str, str] = dict(test_case.headers)
        connect_s = min(5.0, max(1.0, self.timeout_seconds / 2))
        timeout_tuple = (connect_s, self.timeout_seconds)
        kwargs: Dict[str, Any] = {
            "method": method,
            "url": url,
            "params": test_case.query_params,
            "headers": headers,
            "timeout": timeout_tuple,
            "allow_redirects": test_case.follow_redirects,
        }

        if test_case.raw_body is not None:
            headers.setdefault("Content-Type", "application/json")
            kwargs["data"] = test_case.raw_body
        elif test_case.body is not None:
            kwargs["json"] = test_case.body

        return self.session.request(**kwargs)

    @staticmethod
    def _safe_parse_json(response: requests.Response) -> Optional[Any]:
        """Parse JSON response when possible without raising."""
        content_type = response.headers.get("Content-Type", "")
        if "application/json" in content_type.lower():
            try:
                return response.json()
            except json.JSONDecodeError:
                return None
        return None

    def _sleep_backoff(self, attempt: int) -> None:
        """Sleep using exponential backoff."""
        sleep_seconds = self.backoff_factor * (2**attempt)
        if sleep_seconds > 0:
            time.sleep(sleep_seconds)
