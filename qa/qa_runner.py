"""CLI entry point for backend API QA automation."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from core.analyzer import ResponseAnalyzer
from core.client import ApiClient
from core.config_loader import load_test_cases
from core.reporter import ReportWriter
from core.validator import ResponseValidator


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description="Backend API QA automation runner.")
    parser.add_argument(
        "--base-url",
        default="http://localhost:8080",
        help="Backend base URL (default: http://localhost:8080)",
    )
    parser.add_argument(
        "--config",
        default="config/test_cases.yaml",
        help="Path to test config file (default: config/test_cases.yaml)",
    )
    parser.add_argument(
        "--tags",
        default="",
        help="Comma-separated tags to filter test cases.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=10.0,
        help="Request timeout in seconds (default: 10)",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=3,
        help="Retries for transient failures (default: 3)",
    )
    parser.add_argument(
        "--slow-threshold-ms",
        type=int,
        default=2000,
        help="Slow response threshold in ms (default: 2000)",
    )
    parser.add_argument(
        "--model",
        default=None,
        metavar="NAME",
        help=(
            "Ollama model tag (e.g. glm-5.1:cloud). "
            "Default: $OLLAMA_MODEL if set, else llama3.2."
        ),
    )
    parser.add_argument(
        "--ollama-url",
        default="http://localhost:11434/api/generate",
        help="Ollama generate endpoint URL.",
    )
    parser.add_argument(
        "--no-ai",
        action="store_true",
        help="Disable AI analysis.",
    )
    parser.add_argument(
        "--ai-timeout",
        type=float,
        default=None,
        metavar="SEC",
        help=(
            "Max seconds (connect+read) per Ollama /api/generate call. "
            "Default: 120 if model tag contains ':cloud', else 15. Cloud models are often slower."
        ),
    )
    parser.add_argument(
        "--no-progress",
        action="store_true",
        help="Do not print per-test progress lines.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print response payloads in console output.",
    )
    parser.add_argument(
        "--output",
        default="",
        help="Optional JSON report output path.",
    )
    return parser.parse_args()


def _print_unreachable_backend_hint(base_url: str, results: list) -> None:
    """If every test failed to connect, suggest starting the API server."""
    if not results:
        return
    first_err = results[0].network_error or ""
    looks_unreachable = (
        "Connection refused" in first_err
        or "Failed to establish a new connection" in first_err
        or "Name or service not known" in first_err
    )
    if not looks_unreachable:
        return
    if not all(r.network_error for r in results):
        return
    print(
        "\n---\n"
        f"Cannot reach the API at {base_url} (connection failed for every test).\n"
        "Start the backend, then re-run. From the repo root:\n"
        "  cd backend && go run .\n"
        "Default listen port is 8080 unless PORT is set. Override the QA target with:\n"
        "  python qa_runner.py --base-url http://localhost:YOUR_PORT\n"
    )


def main() -> int:
    """Program entrypoint."""
    args = parse_args()
    selected_tags = [t.strip() for t in args.tags.split(",") if t.strip()]

    config_path = Path(args.config)
    if not config_path.is_absolute():
        config_path = Path(__file__).resolve().parent / config_path

    try:
        test_cases = load_test_cases(str(config_path), selected_tags=selected_tags)
    except Exception as exc:
        print(f"Failed to load test config: {exc}")
        return 2

    if not test_cases:
        print("No test cases selected. Check tags/config.")
        return 2

    ollama_model = args.model or os.environ.get("OLLAMA_MODEL") or "llama3.2"

    ai_timeout = args.ai_timeout
    if ai_timeout is None:
        ai_timeout = 120.0 if ":cloud" in ollama_model else 15.0

    client = ApiClient(
        base_url=args.base_url,
        timeout_seconds=args.timeout,
        retries=args.retries,
    )
    validator = ResponseValidator(slow_response_threshold_ms=args.slow_threshold_ms)
    analyzer = ResponseAnalyzer(
        enabled=not args.no_ai,
        ollama_url=args.ollama_url,
        model=ollama_model,
        timeout_seconds=ai_timeout,
    )
    reporter = ReportWriter(verbose=args.verbose)

    results = []
    total = len(test_cases)
    if not args.no_progress:
        print(f"Running {total} test(s) against {args.base_url}", flush=True)
        if not args.no_ai:
            print(f"Ollama model: {ollama_model} (ai-timeout={ai_timeout}s)", flush=True)
    try:
        for idx, test_case in enumerate(test_cases, start=1):
            if not args.no_progress:
                print(f"[{idx}/{total}] {test_case.name} ...", flush=True)
            result = client.run_test_case(test_case)
            validator.validate(result)
            result.ai_insight = analyzer.analyze(result)
            results.append(result)
    finally:
        client.close()
        analyzer.close()

    reporter.print_summary(results)
    output_path = args.output.strip() or None
    report_file = reporter.write_json_report(results, output_path=output_path)
    print(f"\nJSON report written to: {report_file}")

    _print_unreachable_backend_hint(args.base_url, results)

    any_failed = any(not result.passed for result in results)
    return 1 if any_failed else 0


if __name__ == "__main__":
    sys.exit(main())
