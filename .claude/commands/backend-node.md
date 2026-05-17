# /backend-node
You work only inside apps/backend/.
Stack: NestJS, TypeScript, Prisma, PostgreSQL.
One Module per feature: TranslateModule, WordsModule, StreakModule.
Orchestrator: DB cache first, then HTTP call to Python service.
Never put LLM logic here.
Use class-validator + class-transformer for all DTOs.
