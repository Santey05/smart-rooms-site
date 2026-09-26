import type { Metadata } from "next";

import { privacyOperator, UNKNOWN_LABEL } from "@/content/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Как обрабатываются персональные данные на сайте мини-отеля «Смарт румс».",
};

// Каркас политики. Юридический текст (цели, правовые основания, сроки
// хранения, права субъекта, cookie/аналитика по факту) должен быть
// согласован с владельцем отеля — см. CLAUDE.md 11.3. Здесь — только
// то, что известно из архитектуры сайта.
export default function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">
        Политика конфиденциальности
      </h1>

      <section className="grid gap-2">
        <h2 className="text-xl font-medium">Оператор</h2>
        <p className="text-muted-foreground">
          {privacyOperator.name ?? UNKNOWN_LABEL}
          {privacyOperator.contactEmail && <>, {privacyOperator.contactEmail}</>}
        </p>
      </section>

      <section className="grid gap-2">
        <h2 className="text-xl font-medium">Бронирование</h2>
        <p className="text-muted-foreground">
          Данные гостя (имя, телефон, email) и платёжные данные вводятся
          непосредственно в модуле бронирования Bnovo и не сохраняются на этом
          сайте. Форма поиска на главной передаёт в модуль только даты и
          количество гостей.
        </p>
      </section>

      <section className="grid gap-2">
        <h2 className="text-xl font-medium">Технические данные</h2>
        <p className="text-muted-foreground">
          При посещении сайта могут обрабатываться технические данные: IP-адрес,
          сведения о браузере, UTM-метки источника перехода.
        </p>
      </section>
    </main>
  );
}
