/** Основной адрес для canonical, Open Graph, sitemap и robots.
 * Production: NEXT_PUBLIC_SITE_URL в .env.production; локально — localhost.
 * Используем origin, чтобы завершающий слеш не создавал двойные слеши.
 */
export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").origin;
