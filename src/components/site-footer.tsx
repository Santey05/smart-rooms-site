import Link from "next/link";

import { hotel, phoneHref } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {hotel.name}
          {hotel.phone && (
            <>
              {" · "}
              <a href={phoneHref(hotel.phone)} className="inline-flex min-h-11 items-center hover:text-foreground">
                {hotel.phone}
              </a>
            </>
          )}
        </p>
        <nav aria-label="Служебные страницы" className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/contacts" className="inline-flex min-h-11 items-center hover:text-foreground">
            Контакты
          </Link>
          <Link href="/rules" className="inline-flex min-h-11 items-center hover:text-foreground">
            Правила проживания
          </Link>
          <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-foreground">
            Политика конфиденциальности
          </Link>
        </nav>
      </div>
    </footer>
  );
}
