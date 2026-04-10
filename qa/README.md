# Backend QA Automation Tool

Python-based debugging and QA automation for Flight Captain backend APIs.

## Features

- Multi-method API testing (GET, POST, PUT, DELETE)
- Config-driven test cases via YAML
- Status code and JSON schema validation
- Null/empty and logical consistency checks
- Slow-response detection
- Retry mechanism with exponential backoff
- AI-powered quality checks via Ollama (local and free)
- Console summary and JSON report output
- Tag-based filtering and CLI options

## Project Structure

```text
qa/
├── config/test_cases.yaml
├── core/
│   ├── analyzer.py
│   ├── client.py
│   ├── config_loader.py
│   ├── models.py
│   ├── reporter.py
│   └── validator.py
├── qa_runner.py
└── requirements.txt
```

## Setup

From the repo root:

```bash
cd qa
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Optional AI Setup (Ollama)

Install and run Ollama locally:

```bash
ollama serve
ollama pull llama3.2
```

The tool calls `http://localhost:11434/api/generate` by default.

## Run

From `qa/`:

```bash
python qa_runner.py
```

Useful options:

```bash
python qa_runner.py --base-url http://localhost:8080
python qa_runner.py --tags health,affiliate
python qa_runner.py --no-ai
python qa_runner.py --model glm-5.1:cloud
python qa_runner.py --model mistral
# Or set a default model for every run:
# export OLLAMA_MODEL=glm-5.1:cloud && python qa_runner.py
python qa_runner.py --retries 4 --timeout 15 --slow-threshold-ms 2500
python qa_runner.py --output reports/custom_report.json --verbose
python qa_runner.py --ai-timeout 180
python qa_runner.py --no-progress
```

## If the run feels slow or “stuck”

- **Per-test progress** is printed by default (`[1/19] test_name ...`). Use `--no-progress` to hide it.
- **Slow backend calls** (for example Google Flights-backed routes) can take several seconds; adjust `--timeout` if needed.
- **Ollama** runs once per test by default. Tags containing `:cloud` default to **`--ai-timeout 120`**; other models default to **15s**. Override as needed, or use `--no-ai` to skip LLM calls entirely (fastest).
- After an **auth or connection failure**, Ollama calls are skipped for the rest of the run so you do not wait on every test.

## Test Config Format

`config/test_cases.yaml` supports:

- `name`, `description`, `tags`
- `method`, `path`, `query_params`, `headers`
- `body` or `raw_body` (for invalid JSON scenarios)
- `expected_status` (single int or list)
- `expected_schema` (dotted key path -> type string)
- `required_non_null_fields`
- `required_non_empty_fields`
- `required_when_success_fields`
- `allow_empty_array_fields`
- `max_response_time_ms`

Type names for `expected_schema` include:
`string`, `integer`, `number`, `boolean`, `object`, `array`, `null`, `any`.

## Output

The runner prints:

- Passed tests
- Failed tests
- Warnings
- AI insights

It also writes a JSON report to:

- `qa/reports/report_YYYYMMDD_HHMMSS.json` (default), or
- the path provided with `--output`.

## Notes

- Some endpoints depend on backend state (for example, affiliate link endpoints requiring `sessionId`/`optionId`), so the default suite includes stable negative/smoke checks for those.
- AI insights are additive; rule-based checks always run even when AI is disabled or unavailable.
- The LLM is instructed to stay **brief** (plain text, ≤80 words). Long answers in older runs came from an open-ended prompt. Console output **truncates** long AI text unless you pass **`--verbose`** (full text is still in the JSON report).
