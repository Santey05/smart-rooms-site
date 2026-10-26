import type { Metadata } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/site-url";
import { pageMetadata, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/metadata";
import "./globals.css";

// Шрифты дизайна (раздел 4 спецификации): Onest — гротеск интерфейса,
// Cormorant Garamond Italic — «петербургский» акцент только в H1.
// next/font скачивает и хостит их на этапе сборки (запросов к Google Fonts
// из браузера гостя нет). У Cormorant Garamond нет кириллического сабсета —
// кириллица в средней строке H1 естественно откатывается на Georgia/serif
// через --font-accent (см. globals.css), это ожидаемо, а не баг.
const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  ...pageMetadata(SITE_TITLE, SITE_DESCRIPTION, "/"),
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s · Смарт румс" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${onest.variable} ${cormorant.variable} h-full antialiased`}
      // Гасит ложное предупреждение о гидратации, когда браузерное расширение
      // (судя по атрибутам data-yd-* — вероятно, яндексовское) подставляет
      // свои data-атрибуты в <html> до того, как React успел гидратировать
      // страницу. Реальные ошибки гидратации в остальном дереве это не
      // скрывает — suppressHydrationWarning действует только на этот тег.
      suppressHydrationWarning
    >
      <body className="relative flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
