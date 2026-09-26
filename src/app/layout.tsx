import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Используем системный шрифтовой стек (см. --font-sans в globals.css)
// вместо next/font/google: не тянет внешний запрос к Google Fonts на
// каждой сборке/старте (в некоторых окружениях, включая песочницу этой
// сессии, исходящий трафик к fonts.googleapis.com блокируется политикой
// сети) и не требует самостоятельного хостинга шрифта. Системный стек
// корректно поддерживает кириллицу на всех целевых платформах.

export const metadata: Metadata = {
  title: {
    default: "Смарт румс — мини-отель",
    template: "%s · Смарт румс",
  },
  description:
    "Небольшой отель в центре города. Бронирование номеров онлайн.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
