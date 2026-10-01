import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-url";

// /booking сюда не входит: страница помечена robots: { index: false } (см.
// src/app/booking/page.tsx) — это пустая оболочка под iframe Bnovo без
// уникального контента, самостоятельно индексировать её незачем.
const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
}> = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/contacts", priority: 0.6, changeFrequency: "yearly" },
  { path: "/rules", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
