import * as Sentry from "@sentry/nextjs";

/**
 * Мониторинг ошибок фронтенда (CLAUDE.md, раздел 13) — клиентская
 * половина. Серверная/edge — src/instrumentation.ts. Файл обязателен
 * именно под этим именем: при сборке на Turbopack (а мы на нём, см.
 * package.json) устаревший sentry.client.config.ts не подхватывается.
 *
 * Без NEXT_PUBLIC_SENTRY_DSN (см. .env.example) не инициализируем —
 * сайт работает как раньше, просто без отправки ошибок в Sentry.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.2,
  });
}
