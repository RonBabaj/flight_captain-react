"""AI and heuristic quality-control analysis for API test results."""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Optional

import requests

from .models import TestResult


class ResponseAnalyzer:
    """Analyze result quality with Ollama and rule-based checks."""

    def __init__(
        self,
        enabled: bool = True,
        ollama_url: str = "http://localhost:11434/api/generate",
        model: Optional[str] = None,
        timeout_seconds: float = 15.0,
    ) -> None:
        self.enabled = enabled
        self.ollama_url = ollama_url
        self.model = model or os.getenv("OLLAMA_MODEL", "llama3.2")
        self.timeout_seconds = timeout_seconds
        self.session = requests.Session()
        # Skip further Ollama calls after a definitive failure (avoids long hangs per test).
        self._ollama_skip_remaining: bool = False
        self._ollama_skip_reason: Optional[str] = None
        # Last per-request failure (why we did not get an AI paragraph this time).
        self._ollama_last_failure: Optional[str] = None

    def close(self) -> None:
        """Close underlying HTTP session."""
        self.session.close()

    def analyze(self, result: TestResult) -> str:
        """
        Return human-readable quality notes for this result.

        Rule-based insights are always included. Ollama insights are appended when available.
        """
        rule_insights = self._rule_based_insights(result)
        insights: List[str] = list(rule_insights)

        if not self.enabled:
            return self._format_insights(insights, ai_note="AI analysis disabled by CLI.")

        if self._ollama_skip_remaining:
            return self._format_insights(
                insights,
                ai_note=(
                    "Ollama skipped for remaining tests: "
                    f"{self._ollama_skip_reason or 'previous failure'}."
                ),
            )

        self._ollama_last_failure = None
        ai_text = self._ollama_insight(result)
        if ai_text:
            result.ai_used = True
            rule_block = "\n".join(f"- {item}" for item in insights)
            return f"{rule_block}\n\nAI QC:\n{ai_text.strip()}"

        if self._ollama_skip_reason:
            return self._format_insights(
                insights,
                ai_note=f"Ollama: {self._ollama_skip_reason}",
            )

        if self._ollama_last_failure:
            return self._format_insights(
                insights,
                ai_note=f"Ollama: {self._ollama_last_failure}",
            )

        return self._format_insights(
            insights,
            ai_note="Ollama unavailable; falling back to deterministic checks.",
        )

    def _rule_based_insights(self, result: TestResult) -> List[str]:
        insights: List[str] = []
        payload = result.response_json
        status = result.actual_status

        if result.network_error:
            insights.append("Network-level failure prevented a complete API response.")
            return insights

        if status is not None and 200 <= status < 300 and isinstance(payload, dict):
            if "error" in payload:
                insights.append(
                    "Response is marked as successful but still includes an error field."
                )
            if "message" in payload and "data" not in payload and "results" not in payload:
                insights.append(
                    "Response has a message but no obvious data/result payload."
                )

        if isinstance(payload, dict):
            if "success" in payload and payload.get("success") is True:
                for candidate in ("data", "results", "session", "destinations"):
                    if candidate in payload:
                        break
                else:
                    insights.append(
                        "Payload indicates success=true but lacks expected business data fields."
                    )

        if status is not None and status >= 500:
            insights.append("Backend returned a server error, likely a logic/runtime issue.")

        if result.response_time_ms > 3000:
            insights.append("Response latency is high enough to impact user experience.")

        if not insights:
            insights.append("No logical inconsistencies detected by rule-based checks.")

        return insights

    def _ollama_insight(self, result: TestResult) -> Optional[str]:
        def fail(msg: str) -> None:
            self._ollama_last_failure = msg

        prompt = self._build_prompt(result)
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.1},
        }
        # (connect, read) avoids hanging on slow TLS/DNS; read cap bounds total wait per test.
        connect_s = min(3.0, max(0.5, self.timeout_seconds / 4))
        read_s = max(1.0, self.timeout_seconds)
        timeout_tuple = (connect_s, read_s)
        try:
            response = self.session.post(
                self.ollama_url,
                json=payload,
                timeout=timeout_tuple,
            )
            if response.status_code in (401, 403):
                self._ollama_skip_remaining = True
                self._ollama_skip_reason = (
                    f"HTTP {response.status_code} from Ollama (sign in: ollama signin, "
                    "or use --no-ai / a local model)"
                )
                fail(self._ollama_skip_reason)
                return None
            if response.status_code >= 500:
                fail(f"HTTP {response.status_code} from Ollama ({response.text[:200]!r})")
                return None
            if response.status_code >= 400:
                try:
                    err_body = response.json()
                    err_msg = err_body.get("error") if isinstance(err_body, dict) else None
                except json.JSONDecodeError:
                    err_msg = response.text[:200]
                err_lower = str(err_msg or "").lower()
                if err_msg and "unauthorized" in err_lower:
                    self._ollama_skip_remaining = True
                    self._ollama_skip_reason = (
                        "Ollama returned unauthorized (ollama signin, or --no-ai)"
                    )
                    fail(self._ollama_skip_reason)
                elif response.status_code == 404 and "model" in err_lower and "not found" in err_lower:
                    self._ollama_skip_remaining = True
                    self._ollama_skip_reason = (
                        f"model not found ({self.model!r}) — "
                        "`ollama pull <tag>`, or `--model` / $OLLAMA_MODEL"
                    )
                    fail(self._ollama_skip_reason)
                else:
                    fail(f"HTTP {response.status_code} from Ollama: {err_msg or response.text[:200]!r}")
                return None
            try:
                data = response.json()
            except json.JSONDecodeError:
                fail(f"Ollama returned non-JSON body ({response.text[:200]!r})")
                return None

            if not isinstance(data, dict):
                fail(f"unexpected Ollama JSON shape: {type(data).__name__}")
                return None

            if data.get("error"):
                err_msg = str(data.get("error", ""))
                if "unauthorized" in err_msg.lower():
                    self._ollama_skip_remaining = True
                    self._ollama_skip_reason = (
                        "Ollama reported unauthorized (ollama signin, or use --no-ai / local model)"
                    )
                    fail(self._ollama_skip_reason)
                    return None
                fail(f"Ollama error field: {err_msg[:300]}")
                return None

            text = data.get("response")
            if isinstance(text, str) and text.strip():
                return text.strip()
            fail(
                "empty or missing `response` in Ollama JSON "
                f"(keys={list(data.keys())}; try another model or `ollama pull <model>`)"
            )
            return None
        except requests.Timeout:
            fail(
                f"timeout after {read_s:.0f}s read "
                "(cloud models often need --ai-timeout 120 or higher; use --no-ai to skip LLM)"
            )
            return None
        except requests.ConnectionError as exc:
            self._ollama_skip_remaining = True
            self._ollama_skip_reason = f"connection error ({exc!s})"
            fail(self._ollama_skip_reason)
            return None
        except requests.RequestException as exc:
            fail(f"request failed ({exc!s})")
            return None
        except json.JSONDecodeError as exc:
            fail(f"JSON decode error ({exc!s})")
            return None
        return None

    def _build_prompt(self, result: TestResult) -> str:
        test_case = result.test_case
        response_preview = result.response_json
        if response_preview is None:
            response_preview = result.response_text[:1200]

        return (
            "You are a backend QA assistant reviewing one automated API test.\n"
            "Rules:\n"
            "- Answer in plain text only (no markdown headings, no bold, no numbered essays).\n"
            "- Maximum 80 words total.\n"
            "- If the response matches the test intent, reply exactly: OK — no issues.\n"
            "- Otherwise give at most 2 short sentences naming the single most important risk.\n"
            "- Do not restate the whole payload; do not suggest redesigning REST or Kubernetes.\n\n"
            f"Test Name: {test_case.name}\n"
            f"Description: {test_case.description}\n"
            f"HTTP Method: {test_case.method}\n"
            f"Path: {test_case.path}\n"
            f"Expected Status: {test_case.expected_status}\n"
            f"Actual Status: {result.actual_status}\n"
            f"Response Time (ms): {result.response_time_ms:.2f}\n"
            "Response Payload:\n"
            f"{json.dumps(response_preview, ensure_ascii=True, indent=2, default=str)}\n"
        )

    @staticmethod
    def _format_insights(insights: List[str], ai_note: Optional[str] = None) -> str:
        lines = []
        if ai_note:
            lines.append(ai_note)
        lines.extend(f"- {item}" for item in insights)
        return "\n".join(lines)
