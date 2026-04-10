"""Reporting helpers for test execution results."""

from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from colorama import Fore, Style, init

from .models import TestResult

init(autoreset=True)


class ReportWriter:
    """Render terminal summary and persist machine-readable reports."""

    def __init__(self, verbose: bool = False, max_ai_console_chars: int = 600) -> None:
        self.verbose = verbose
        self.max_ai_console_chars = max_ai_console_chars

    def print_summary(self, results: List[TestResult]) -> None:
        """Print user-friendly report to stdout."""
        passed = [r for r in results if r.passed]
        failed = [r for r in results if not r.passed]
        warning_count = sum(
            1 for result in results for issue in result.issues if issue.severity == "warning"
        )
        ai_count = sum(1 for result in results if result.ai_insight)

        print("\n=== QA Summary ===")
        print(f"{Fore.GREEN}Passed:{Style.RESET_ALL} {len(passed)}")
        print(f"{Fore.RED}Failed:{Style.RESET_ALL} {len(failed)}")
        print(f"{Fore.YELLOW}Warnings:{Style.RESET_ALL} {warning_count}")
        print(f"{Fore.CYAN}AI insights:{Style.RESET_ALL} {ai_count}")

        print("\n=== Per Test Result ===")
        for result in results:
            status_word = "PASS" if result.passed else "FAIL"
            color = Fore.GREEN if result.passed else Fore.RED
            print(
                f"{color}[{status_word}]{Style.RESET_ALL} "
                f"{result.test_case.name} "
                f"(status={result.actual_status}, {result.response_time_ms:.2f}ms)"
            )
            for issue in result.issues:
                issue_color = Fore.RED if issue.severity == "error" else Fore.YELLOW
                print(
                    f"  {issue_color}- {issue.severity.upper()}[{issue.category}]: "
                    f"{issue.message}{Style.RESET_ALL}"
                )

            if result.ai_insight:
                ai_text = result.ai_insight
                if (
                    not self.verbose
                    and self.max_ai_console_chars > 0
                    and len(ai_text) > self.max_ai_console_chars
                ):
                    ai_text = (
                        ai_text[: self.max_ai_console_chars].rstrip()
                        + "\n... (truncated; use --verbose for full AI text)"
                    )
                lines = ai_text.splitlines()
                if lines:
                    print(f"  {Fore.CYAN}AI:{Style.RESET_ALL} {lines[0]}")
                    for line in lines[1:]:
                        print(f"      {line}")

            if self.verbose:
                body = result.response_json
                if body is None:
                    body = result.response_text
                print(f"  Response body: {body}")

    def write_json_report(
        self,
        results: List[TestResult],
        output_path: Optional[str] = None,
    ) -> Path:
        """Write a JSON report and return its path."""
        report_path = Path(output_path) if output_path else self._default_report_path()
        report_path.parent.mkdir(parents=True, exist_ok=True)

        payload = self._build_payload(results)
        with report_path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2, ensure_ascii=True)

        return report_path

    def _default_report_path(self) -> Path:
        timestamp = datetime.now(tz=timezone.utc).strftime("%Y%m%d_%H%M%S")
        return Path("reports") / f"report_{timestamp}.json"

    def _build_payload(self, results: List[TestResult]) -> Dict[str, Any]:
        totals = Counter()
        for result in results:
            totals["passed" if result.passed else "failed"] += 1
            for issue in result.issues:
                totals[f"{issue.severity}_issues"] += 1

        return {
            "generated_at_utc": datetime.now(tz=timezone.utc).isoformat(),
            "summary": {
                "total_tests": len(results),
                "passed_tests": totals.get("passed", 0),
                "failed_tests": totals.get("failed", 0),
                "warning_count": totals.get("warning_issues", 0),
                "error_count": totals.get("error_issues", 0),
                "ai_insights_count": sum(1 for result in results if result.ai_insight),
            },
            "results": [result.to_dict() for result in results],
        }
