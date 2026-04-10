"""Core data models for the API QA runner."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def utc_now_iso() -> str:
    """Return an ISO-8601 UTC timestamp."""
    return datetime.now(tz=timezone.utc).isoformat()


@dataclass
class ValidationIssue:
    """Represents a single validation or analysis finding."""

    severity: str  # error | warning | info
    category: str
    message: str
    field: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Serialize issue to dictionary."""
        return asdict(self)


@dataclass
class TestCase:
    """Defines one API test scenario loaded from YAML config."""

    name: str
    method: str
    path: str
    description: str = ""
    tags: List[str] = field(default_factory=list)
    headers: Dict[str, str] = field(default_factory=dict)
    query_params: Dict[str, Any] = field(default_factory=dict)
    body: Optional[Any] = None
    raw_body: Optional[str] = None
    expected_status: List[int] = field(default_factory=lambda: [200])
    expected_schema: Dict[str, str] = field(default_factory=dict)
    expected_values: Dict[str, Any] = field(default_factory=dict)
    required_non_null_fields: List[str] = field(default_factory=list)
    required_non_empty_fields: List[str] = field(default_factory=list)
    required_when_success_fields: List[str] = field(default_factory=list)
    allow_empty_array_fields: List[str] = field(default_factory=list)
    max_response_time_ms: Optional[int] = None
    follow_redirects: bool = True

    def to_dict(self) -> Dict[str, Any]:
        """Serialize case to dictionary."""
        return asdict(self)


@dataclass
class TestResult:
    """Stores execution data and findings for one test case."""

    test_case: TestCase
    started_at: str = field(default_factory=utc_now_iso)
    finished_at: Optional[str] = None
    request_url: str = ""
    request_headers: Dict[str, str] = field(default_factory=dict)
    request_query_params: Dict[str, Any] = field(default_factory=dict)
    request_body: Optional[Any] = None
    actual_status: Optional[int] = None
    response_time_ms: float = 0.0
    response_headers: Dict[str, str] = field(default_factory=dict)
    response_text: str = ""
    response_json: Optional[Any] = None
    network_error: Optional[str] = None
    retries_used: int = 0
    issues: List[ValidationIssue] = field(default_factory=list)
    ai_insight: Optional[str] = None
    ai_used: bool = False

    @property
    def passed(self) -> bool:
        """A test passes when there are no error-level issues."""
        return not any(issue.severity == "error" for issue in self.issues)

    def add_issue(
        self,
        severity: str,
        category: str,
        message: str,
        field: Optional[str] = None,
    ) -> None:
        """Append a new issue to this result."""
        self.issues.append(
            ValidationIssue(
                severity=severity,
                category=category,
                message=message,
                field=field,
            )
        )

    def finalize(self) -> None:
        """Set completion timestamp."""
        self.finished_at = utc_now_iso()

    def to_dict(self) -> Dict[str, Any]:
        """Serialize nested result for report output."""
        return {
            "test_case": self.test_case.to_dict(),
            "started_at": self.started_at,
            "finished_at": self.finished_at,
            "request_url": self.request_url,
            "request_headers": self.request_headers,
            "request_query_params": self.request_query_params,
            "request_body": self.request_body,
            "actual_status": self.actual_status,
            "response_time_ms": round(self.response_time_ms, 2),
            "response_headers": self.response_headers,
            "response_text": self.response_text,
            "response_json": self.response_json,
            "network_error": self.network_error,
            "retries_used": self.retries_used,
            "issues": [issue.to_dict() for issue in self.issues],
            "ai_insight": self.ai_insight,
            "ai_used": self.ai_used,
            "passed": self.passed,
        }
