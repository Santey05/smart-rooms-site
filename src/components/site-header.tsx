import Link from "next/link";

import { Button } from "@/components/ui/button";
import { hotel } from "@/content/site";

const NAV_LINKS = [
  { href: "/contacts", label: "Контакты" },
  { href: "/rules", label: "Правила проживания" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {hotel.name}
        </Link>
        <nav aria-label="Основная навигация" className="flex items-center gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/booking">Забронировать</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
