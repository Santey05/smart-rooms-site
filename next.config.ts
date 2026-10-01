import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  // Самодостаточная сборка для Docker-деплоя (Amvera, см. Dockerfile) —
  // в .next/standalone попадают только реально нужные файлы из
  // node_modules, не весь node_modules целиком.
  output: "standalone",
};

// Без NEXT_PUBLIC_SENTRY_DSN (см. .env.example) SDK сам себя не
// инициализирует (src/instrumentation.ts, src/instrumentation-client.ts) —
// обёртка здесь не требует ключа сама по себе, просто готовит сборку
// (аплоад сорсмапов отключён, пока не заданы SENTRY_ORG/SENTRY_PROJECT/
// SENTRY_AUTH_TOKEN).
export default withSentryConfig(nextConfig, {
  silent: true,
  widenClientFileUpload: true,
});
