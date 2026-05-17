# WordTracker

Bilingual EN ↔ RU dictionary PWA.

## Services
- apps/frontend/        Next.js 14   :3000
- apps/backend/         NestJS       :3001
- services/translation/ FastAPI      :8000
- packages/types/       Shared TS types

## Rules
- Never hardcode colors — use CSS custom properties
- Never commit .env — only .env.example
- Shared types only in packages/types/index.ts
- Commit after each completed stage in docs/STAGES.md

## Agents
/frontend       — Next.js, components, pages, PWA
/backend-node   — NestJS, Prisma, DB, auth
/backend-python — FastAPI, LLM, translation
/devops         — Docker, CI/CD, deploy
