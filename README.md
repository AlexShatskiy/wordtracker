# WordTracker

Bilingual EN ↔ RU dictionary PWA.

## Services

| Service | Stack | Port |
|---|---|---|
| `apps/frontend` | Next.js 16, TypeScript, Tailwind CSS | 3000 |
| `apps/backend` | NestJS 11, TypeScript | 3001 |
| `services/translation` | FastAPI, Python 3.11 | 8000 |

## Getting started

**Prerequisites:** Node.js 22, pnpm 11, Python 3.11

```bash
# Install JS dependencies
pnpm install

# Frontend
cd apps/frontend && npm run dev

# Backend Node
cd apps/backend && pnpm start:dev

# Backend Python
cd services/translation
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Health checks

```bash
curl localhost:3001/health   # {"ok":true,"service":"backend-node"}
curl localhost:8000/health   # {"ok":true,"service":"backend-python"}
```
