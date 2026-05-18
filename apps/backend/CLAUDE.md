# Backend Rules — NestJS 11 / TypeScript

## Architecture
- Follow NestJS module boundaries: Controller → Service → Repository.
- Controllers handle HTTP only — no business logic, no DB calls.
- Services contain business logic. One service per domain concept.
- Use NestJS DI — never instantiate services manually.

## TypeScript
- Strict mode always on. No `any`.
- Use DTOs with class-validator for all incoming request data.
- Return consistent response shapes: { data, error, meta }.

## NestJS Specifics
- Validate input at the boundary via ValidationPipe (globally enabled).
- Use Guards for auth, Interceptors for cross-cutting concerns (logging, transform).
- Never put secrets in code — use ConfigService and environment variables.

## Error Handling
- Throw NestJS built-in exceptions (NotFoundException, BadRequestException, etc.).
- Never return null to signal an error — throw explicitly.
- Log errors with context: what was happening, what input caused it.
- Don't catch what you can't handle.
