# Code Style

- Never hardcode colors — use CSS custom properties
- Shared types only in packages/types/index.ts
- Functions do ONE thing. If you need "and" to describe it — split it.
- Max function length: ~30 lines. Max file length: ~300 lines.
- Meaningful names: getUserById not getU, isLoading not flag.
- No magic numbers/strings — use named constants.
- Avoid deep nesting (max 2–3 levels). Use early returns and guard clauses.
- Delete dead code — don't comment it out.
- No premature optimization. Make it work → make it clear → optimize only if needed.
- Don't comment WHAT — comment WHY (only if non-obvious).
