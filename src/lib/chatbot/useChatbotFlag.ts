"use client";

import { useEffect, useState } from "react";

const KEY = "sakk_chatbot_enabled";

export function useChatbotFlag() {
  // Start as undefined so we never render during SSR — avoids hydration mismatch
  const [enabled, setEnabled] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    setEnabled(stored === null ? true : stored === "true");
  }, []);

  function toggle() {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(KEY, String(next));
      return next;
    });
  }

  return { enabled, toggle };
}
