import type { Metadata } from "next";
import Link from "next/link";

import { ContactList } from "@/components/contact-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Адрес, телефон и часы работы ресепшена мини-отеля «Смарт румс».",
};

export default function ContactsPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Контакты</h1>
      <ContactList />
      <div>
        <Button asChild size="lg">
          <Link href="/booking">Смотреть номера и цены</Link>
        </Button>
      </div>
    </main>
  );
}
