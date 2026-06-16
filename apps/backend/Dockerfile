FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile --filter backend...
COPY apps/backend/ ./apps/backend/
WORKDIR /app/apps/backend
RUN pnpm db:generate
RUN pnpm build

FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
WORKDIR /app/apps/backend
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/main"]
