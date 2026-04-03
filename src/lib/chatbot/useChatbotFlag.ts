"use client";

import { useEffect, useState } from "react";

const KEY = "sakk_chatbot_enabled";

export function useChatbotFlag() {
  // Start as undefined so we never render during SSR — avoids hydration mismatch
  const [enabled, setEnabled] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(stored === null ? true : stored === "true");

    // Sync across all instances when localStorage changes (e.g. profile toggle → AppShell)
    function onStorage(e: StorageEvent) {
      if (e.key === KEY) {
        setEnabled(e.newValue === null ? true : e.newValue === "true");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function toggle() {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(KEY, String(next));
      // Defer dispatch so it doesn't trigger setState on other components mid-render
      setTimeout(() => {
        window.dispatchEvent(
          new StorageEvent("storage", { key: KEY, newValue: String(next) }),
        );
      }, 0);
      return next;
    });
  }

  return { enabled, toggle };
}
