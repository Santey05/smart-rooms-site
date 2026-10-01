# syntax=docker/dockerfile:1
#
# Деплой на Amvera (см. amvera.yaml) собственным Dockerfile, а не их
# управляемым toolchain — на момент написания Amvera официально
# подтверждает только npm/yarn, а проект жёстко закреплён на
# pnpm@10.28.0 (см. packageManager в package.json). corepack ниже
# гарантирует именно эту версию pnpm при сборке.
#
# NEXT_PUBLIC_*-переменные встраиваются в клиентский бандл во время
# `next build`, а не при запуске контейнера — у Amvera переменные из
# веб-интерфейса недоступны на этапе сборки, поэтому реальные значения
# лежат в закоммиченном .env.production (все они не секреты, см. его
# комментарии), а не передаются через ENV/ARG сюда.
#
# .env.production нужен ещё раз и в runner-слое: серверный код
# (src/instrumentation.ts) читает NEXT_PUBLIC_SENTRY_DSN заново при
# самом запуске контейнера (next-server.js сам вызывает loadEnvConfig
# при старте, это не только build-time механизм) — без файла рядом с
# server.js серверная часть Sentry тихо не инициализируется.

FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.env.production ./
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
