# Frontend Rules — Next.js 16 / TypeScript / Tailwind

## TypeScript

- Strict mode always on. No `any` — use `unknown` + type narrowing if needed.
- Prefer `type` over `interface` unless you need declaration merging.
- Infer types where obvious; annotate function signatures explicitly.

## Next.js

- Default to Server Components. Use `"use client"` only when necessary (interactivity, browser APIs).
- Keep pages thin — business logic goes into hooks or server actions, not JSX.
- Use Next.js file-based routing conventions; don't fight the framework.

## Components

- One component per file. Filename = component name.
- Props type defined directly above the component.
- Prefer small composable components over large monoliths.
- No business logic in components — extract to hooks or server actions.

## Tailwind

- Use Tailwind utility classes directly; avoid custom CSS unless unavoidable.
- Extract repeated class combinations into a component, not a custom class.

## State & Side Effects

- Co-locate state as close to where it's used as possible.
- Custom hooks for reusable logic (useAuth, useForm, etc.).
- No direct DOM manipulation unless unavoidable.

## Imports

- Absolute imports over deep relative paths (configure @/ alias).
- Group: external libs → internal modules → local files.
