import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  // Самодостаточная сборка для Docker-деплоя (Amvera, см. Dockerfile) —
  // в .next/standalone попадают только реально нужные файлы из
  // node_modules, не весь node_modules целиком.
  output: "standalone",
  images: {
    // Диагностика на проде (чат, 2026-10-01): графики Amvera показали
    // CPU throttling (упор в квоту ~40%) и ответы по 5–10 сек при живом
    // трафике — на урезанном vCPU пережатие фото через sharp при первом
    // запросе каждого размера оказалось слишком тяжёлым. Отдаём фото как
    // есть вместо серверной оптимизации на лету — сами файлы уже разумного
    // размера, нагрузка небольшая (2–3 брони в сутки), а сайт важнее
    // идеального Lighthouse-скора по весу картинок.
    unoptimized: true,
  },
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
