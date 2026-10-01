/**
 * Базовый URL сайта — нужен для абсолютных ссылок в metadata (canonical,
 * Open Graph), sitemap.xml и robots.txt (CLAUDE.md, раздел 7).
 *
 * До деплоя на боевой домен переменная NEXT_PUBLIC_SITE_URL не задана (или
 * пуста — так и оставлена пустой в .env.production до первого деплоя на
 * Amvera, см. его комментарий) — используется localhost, чтобы
 * `pnpm build`/`pnpm dev` не падали. `||`, а не `??` — пустая строка из
 * .env-файла должна откатываться на дефолт точно так же, как отсутствие
 * переменной. Перед production обязательно задать реальный домен в .env.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
