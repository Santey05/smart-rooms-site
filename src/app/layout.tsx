import type { Metadata } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  title: {
    default: "Смарт румс — мини-отель на Марата, 30, Санкт-Петербург",
    template: "%s · Смарт румс",
  },
  description:
    "Мини-отель в доме 1860 года на улице Марата. Пять минут пешком до метро «Владимирская».",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${onest.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
