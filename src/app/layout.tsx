import type { Metadata } from "next";
import { Caveat, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Шрифты дизайна: Manrope — основной текст, Caveat — рукописные акценты.
// next/font скачивает и хостит их на этапе сборки (запросов к Google Fonts
// из браузера гостя нет). Если сборка идёт в окружении без доступа к
// fonts.googleapis.com — build упадёт; в таком окружении вернуть системный
// стек (см. --font-sans в globals.css, он остаётся запасным).
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Смарт Румс — мини-отель в Санкт-Петербурге",
    template: "%s · Смарт Румс",
  },
  description:
    "Уютный и недорогой мини-отель в центре Санкт-Петербурга, ул. Марата, 30. Бронирование номеров онлайн.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
