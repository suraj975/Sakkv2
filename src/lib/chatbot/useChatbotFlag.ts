"use client";

import { useEffect, useState } from "react";

const KEY = "sakk_chatbot_enabled";

export function useChatbotFlag() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) setEnabled(stored === "true");
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
