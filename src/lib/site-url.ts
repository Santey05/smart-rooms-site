/**
 * Базовый URL сайта — нужен для абсолютных ссылок в metadata (canonical,
 * Open Graph), sitemap.xml и robots.txt (CLAUDE.md, раздел 7).
 *
 * До деплоя на боевой домен переменная NEXT_PUBLIC_SITE_URL не задана —
 * используется localhost, чтобы `pnpm build`/`pnpm dev` не падали.
 * Перед production обязательно задать реальный домен в .env (см. .env.example).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
