import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

// Источники взяты из сетевой проверки сайта 26.10.2026.
// Report-Only собирает диагностику в консоли браузера, не блокируя Bnovo
// и его платёжные переходы. Подресурсы чужого iframe регулирует сам Bnovo.
const sentryOrigin = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? new URL(process.env.NEXT_PUBLIC_SENTRY_DSN).origin : "";
const diagnosticCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://api-maps.yandex.ru https://yastatic.net https://widget.reservationsteps.ru",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://yastatic.net https://core-renderer-tiles.maps.yandex.net https://yandex.ru",
  "font-src 'self'",
  ("connect-src 'self' " + sentryOrigin).trim(),
  "frame-src https://reservationsteps.ru https://widget.reservationsteps.ru",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ...(process.env.NODE_ENV === "production"
          ? [{ key: "Content-Security-Policy-Report-Only", value: diagnosticCsp }]
          : []),
      ],
    }];
  },
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
