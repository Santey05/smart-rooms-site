/**
 * Общий контент сайта, не привязанный к конкретным номерам.
 *
 * Решение (CLAUDE.md 2.2, этап 2): CMS не используется — контент лежит в
 * репозитории и правится через коммит. Всё, что касается номеров (названия
 * типов, описания, фото, цены), здесь НЕ хранится — это ведётся в личном
 * кабинете Bnovo (CLAUDE.md, раздел 5).
 *
 * `null` = значение ещё не известно; на страницах показывается «Уточняется».
 * Не подставлять сюда выдуманные данные — заполнять только фактами отеля.
 */

export interface HotelInfo {
  name: string;
  /** Полный почтовый адрес */
  address: string | null;
  /** Телефон в международном формате, например "+7 900 000-00-00" */
  phone: string | null;
  email: string | null;
  /** Часы работы ресепшена, например "круглосуточно" */
  receptionHours: string | null;
  /** Время заезда, например "14:00" */
  checkInTime: string | null;
  /** Время выезда, например "12:00" */
  checkOutTime: string | null;
}

export const hotel: HotelInfo = {
  name: "Смарт румс",
  address: null,
  phone: null,
  email: null,
  receptionHours: null,
  checkInTime: null,
  checkOutTime: null,
};

export interface StayRule {
  title: string;
  text: string;
}

/** Правила проживания — добавлять только утверждённые отелем пункты. */
export const stayRules: StayRule[] = [];

export interface PrivacyOperator {
  /** Наименование оператора персональных данных (юрлицо или ИП) */
  name: string | null;
  /** Контакт для обращений по персональным данным */
  contactEmail: string | null;
}

export const privacyOperator: PrivacyOperator = {
  name: null,
  contactEmail: null,
};

export const UNKNOWN_LABEL = "Уточняется";

/** Ссылка `tel:` из телефона в свободном формате (оставляет цифры и ведущий +). */
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
