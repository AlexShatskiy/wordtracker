# WordTracker — Code Quality Rules

## Core Principles
- KISS: Prefer the simplest solution that works. If it feels clever, simplify it.
- DRY: Extract repeated logic, but only when duplication appears 3+ times (rule of three).
- YAGNI: Don't add features or abstractions until they're actually needed.
- Readability first: code is read 10x more than written. Optimize for the reader.

## General Rules
- Functions do ONE thing. If you need "and" to describe it — split it.
- Max function length: ~30 lines. Max file length: ~300 lines.
- Meaningful names: getUserById not getU, isLoading not flag.
- No magic numbers/strings — use named constants.
- Avoid deep nesting (max 2–3 levels). Use early returns and guard clauses.
- Delete dead code — don't comment it out.
- No premature optimization. Make it work → make it clear → optimize only if needed.

## Comments
- Don't comment WHAT — comment WHY (only if non-obvious).
- If you need a comment to explain code, consider renaming or refactoring instead.

## Error Handling
- Handle errors explicitly. Never silently swallow exceptions.
- Fail fast and loudly in development.
