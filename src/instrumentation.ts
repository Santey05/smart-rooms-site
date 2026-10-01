import * as Sentry from "@sentry/nextjs";

/**
 * Мониторинг ошибок фронтенда (CLAUDE.md, раздел 13) — серверная/edge
 * половина. Клиентская — src/instrumentation-client.ts.
 *
 * Без NEXT_PUBLIC_SENTRY_DSN (см. .env.example) ничего не инициализируем —
 * остальной код Sentry без dsn безопасно no-op'ает сам по себе, но явная
 * проверка здесь читается понятнее, чем вызов init с пустым dsn.
 */
export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.2,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
