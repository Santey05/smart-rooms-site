import type { Metadata } from "next";
import Link from "next/link";

import { ContactList } from "@/components/contact-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Адрес, телефон и как заселиться в мини-отель «Смарт румс».",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Контакты</h1>
      <ContactList />
      <div>
        <Button asChild variant="dark" size="lg" className="rounded-[10px]">
          <Link href="/booking">Смотреть номера и цены</Link>
        </Button>
      </div>
    </main>
  );
}
