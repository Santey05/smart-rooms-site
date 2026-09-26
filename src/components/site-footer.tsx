import Link from "next/link";

import { hotel, phoneHref } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {hotel.name}
          {hotel.phone && (
            <>
              {" · "}
              <a href={phoneHref(hotel.phone)} className="hover:text-foreground">
                {hotel.phone}
              </a>
            </>
          )}
        </p>
        <nav aria-label="Служебные страницы" className="flex gap-4">
          <Link href="/contacts" className="hover:text-foreground">
            Контакты
          </Link>
          <Link href="/rules" className="hover:text-foreground">
            Правила проживания
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Политика конфиденциальности
          </Link>
        </nav>
      </div>
    </footer>
  );
}
