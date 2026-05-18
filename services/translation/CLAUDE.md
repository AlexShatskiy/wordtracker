# Backend Rules — FastAPI / Python 3.11

## Architecture
- Thin routers — business logic lives in services, not route functions.
- One responsibility per module/class/function.
- Never put secrets in code — use environment variables (python-dotenv or similar).

## Python Style
- Follow PEP 8. Use type hints everywhere — parameters, return types, fields.
- Use Pydantic models for all request/response schemas. Never raw dicts at boundaries.
- Prefer dataclasses for internal data structures.
- Explicit is better than implicit (Zen of Python).
- Functions under 30 lines. Classes under 200 lines.

## FastAPI Specifics
- Use dependency injection (Depends) for shared logic: DB sessions, auth, services.
- Validate input via Pydantic schemas — never manually validate request data.
- Use proper HTTP status codes. Document routes with docstrings or response_model.

## Error Handling
- Never return None to signal an error — raise HTTPException explicitly.
- Log errors with context: what was happening, what input caused it.
- Don't catch what you can't handle.
