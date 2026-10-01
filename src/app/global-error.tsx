"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Ловит ошибки рендера в самом корневом layout (их не поймает обычный
 * app/error.tsx) и отправляет в Sentry. global-error заменяет весь layout
 * целиком, когда срабатывает, поэтому сам объявляет <html>/<body> и не
 * полагается на Tailwind/шрифты из layout.tsx — только инлайн-стили.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            color: "#141b22",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Что-то пошло не так</h1>
          <p style={{ color: "#5b6670" }}>Попробуйте обновить страницу ещё раз.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              borderRadius: "10px",
              background: "#1d2a35",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}
