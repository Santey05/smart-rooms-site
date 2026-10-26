import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

import { hotel, phoneHref, privacyOperator } from "@/content/site";

export const metadata: Metadata = pageMetadata("Политика конфиденциальности", "Как обрабатываются данные на сайте мини-отеля «Смарт румс».", "/privacy");

// Фактическая схема сайта (CLAUDE.md 11.3). Имя оператора пока не публикуется
// по указанию владельца. Правовые основания, сроки хранения и распределение
// обязанностей между отелем и сервисами требуют отдельного уточнения;
// не подставлять их автоматически и не считать этот текст юридической проверкой.
export default function PrivacyPage() {
  const contactEmail = privacyOperator.contactEmail ?? hotel.email;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <div className="grid gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Политика конфиденциальности</h1>
        <p className="leading-relaxed text-muted-foreground">
          Информация об обработке данных при использовании сайта мини-отеля «Смарт румс».
        </p>
      </div>
      {privacyOperator.name && (
        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Оператор</h2>
          <p className="text-muted-foreground">{privacyOperator.name}</p>
        </section>
      )}
      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Поиск размещения</h2>
        <p className="leading-relaxed text-muted-foreground">
          Форма поиска передаёт в модуль Bnovo выбранные даты заезда и выезда, количество взрослых и возраст каждого ребёнка.
          Эти сведения нужны модулю для поиска вариантов размещения. Форма поиска не запрашивает имя, телефон или email гостя.
        </p>
      </section>
      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Оформление бронирования</h2>
        <p className="leading-relaxed text-muted-foreground">
          Данные гостя, необходимые для оформления брони, вводятся непосредственно в модуле Bnovo.
          Если выбран онлайн-платёж, он проводится через платёжный сервис, подключённый к Bnovo.
          На сайте нет собственной базы бронирований и платежей. Подтверждение, отмена и возврат обрабатываются через Bnovo с учётом условий выбранного тарифа.
        </p>
      </section>
      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Технические данные и мониторинг</h2>
        <p className="leading-relaxed text-muted-foreground">
          При загрузке сайта браузер передаёт серверу технические сведения, включая IP-адрес и данные HTTP-запроса.
          Для диагностики ошибок и производительности подключён Sentry. В отчёты могут попадать сведения об ошибке,
          адресе страницы, браузере и устройстве. В адресе страницы могут присутствовать параметры поиска размещения и метки источника перехода.
        </p>
      </section>
      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Яндекс.Карты и встроенные сервисы</h2>
        <p className="leading-relaxed text-muted-foreground">
          Для показа карты браузер загружает ресурсы Яндекса. При использовании карты сервис может получать технические сведения,
          включая IP-адрес и идентификаторы устройства. Обработка данных Яндексом описана в его{" "}
          <a href="https://yandex.ru/legal/confidential/ru/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">политике конфиденциальности</a>.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Встроенные сервисы могут использовать cookies и хранилища браузера. Их можно ограничить в настройках браузера;
          это может повлиять на работу карты и модуля бронирования.
        </p>
      </section>
      <section aria-labelledby="privacy-contact" className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 id="privacy-contact" className="text-xl font-semibold">Обращения по вопросам персональных данных</h2>
        <p className="leading-relaxed text-muted-foreground">По вопросам обработки данных на сайте можно связаться с администрацией отеля:</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {contactEmail && <a href={`mailto:${contactEmail}`} className="inline-flex min-h-11 items-center break-all underline underline-offset-4">{contactEmail}</a>}
          {hotel.phone && <a href={phoneHref(hotel.phone)} className="inline-flex min-h-11 items-center underline underline-offset-4">{hotel.phone}</a>}
        </div>
      </section>
    </main>
  );
}
