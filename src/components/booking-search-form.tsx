"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildBookingHref } from "@/lib/booking";

/**
 * Форма поиска дат/гостей на главной странице.
 *
 * Правило CLAUDE.md 4.1: эта форма ничего не проверяет и не считает.
 * Она только собирает дату заезда, дату выезда, число взрослых и детей
 * и передаёт их на страницу /booking, где всё остальное делает модуль
 * Bnovo. Не добавлять сюда проверку доступности/вместимости номеров.
 */

function defaultCheckIn(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function defaultCheckOut(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

export function BookingSearchForm() {
  const router = useRouter();
  const formId = useId();

  const [checkIn, setCheckIn] = useState(defaultCheckIn());
  const [checkOut, setCheckOut] = useState(defaultCheckOut());
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const href = buildBookingHref({
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children: children > 0 ? children : undefined,
    });

    router.push(href);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
    >
      <div className="grid gap-1.5">
        <Label htmlFor={`${formId}-checkin`}>Заезд</Label>
        <Input
          id={`${formId}-checkin`}
          type="date"
          required
          value={checkIn}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${formId}-checkout`}>Выезд</Label>
        <Input
          id={`${formId}-checkout`}
          type="date"
          required
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${formId}-adults`}>Взрослые</Label>
        <Input
          id={`${formId}-adults`}
          type="number"
          min={1}
          max={10}
          required
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${formId}-children`}>Дети</Label>
        <Input
          id={`${formId}-children`}
          type="number"
          min={0}
          max={10}
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
        />
      </div>

      <Button type="submit" size="lg" className="w-full lg:w-auto">
        Смотреть номера и цены
      </Button>
    </form>
  );
}
