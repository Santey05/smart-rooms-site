import type { Metadata } from "next";
import { hotel } from "@/content/site";

export const SITE_TITLE = "Смарт румс — мини-отель на Марата, 30, Санкт-Петербург";
export const SITE_DESCRIPTION = "Мини-отель в доме 1860 года на улице Марата. " + hotel.metroMinutes + " минут пешком до метро «" + hotel.metroStation + "».";

// Next.js заменяет вложенный openGraph целиком, поэтому каждая страница
// получает полный набор полей, включая собственный адрес и заголовок.
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const socialTitle = path === "/" ? title : title + " · " + hotel.name;
  return {
    title: { absolute: socialTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website", locale: "ru_RU", siteName: hotel.name,
      title: socialTitle, description, url: path,
      images: [{ url: "/images/hero-desktop.webp", width: 2000, height: 1116, alt: SITE_TITLE }],
    },
    twitter: {
      card: "summary_large_image", title: socialTitle, description,
      images: ["/images/hero-desktop.webp"],
    },
  };
}
