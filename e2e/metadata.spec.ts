import { expect, test } from "@playwright/test";

for (const [path, title] of [
  ["/", "Смарт румс — мини-отель на Марата, 30, Санкт-Петербург"],
  ["/contacts", "Контакты · Смарт румс"],
  ["/rules", "Правила проживания · Смарт румс"],
  ["/privacy", "Политика конфиденциальности · Смарт румс"],
  ["/booking", "Бронирование · Смарт румс"],
]) {
  test("метаданные соответствуют странице " + path, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(path);
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).href).toBe(new URL(canonical!).href);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    if (path === "/") {
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /7 минут пешком/);
      const hotel = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
      expect(hotel.email).toBe("itt.ppr@mail.ru");
    }
    if (path === "/booking") {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
  });
}

