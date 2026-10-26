"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** Быстрый переход к форме, когда ни форма, ни футер не видны. */
export function MobileBookingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("hero-card");
    const footer = document.querySelector("footer");
    if (!form || !footer) return;
    let formVisible = true;
    let footerVisible = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === form) formVisible = entry.isIntersecting;
        if (entry.target === footer) footerVisible = entry.isIntersecting;
      }
      setVisible(!formVisible && !footerVisible);
    });
    observer.observe(form);
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;
  return (
    <aside aria-label="Быстрое бронирование" className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-40 lg:hidden">
      <Button asChild variant="default" className="h-12 w-full rounded-[10px] shadow-2xl">
        <a href="#hero-card">Забронировать</a>
      </Button>
    </aside>
  );
}
