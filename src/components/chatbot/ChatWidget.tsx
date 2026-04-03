"use client";

import { useState } from "react";
import ChatButton from "./ChatButton";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Button only shown when panel is closed */}
      {!open && <ChatButton onClick={() => setOpen(true)} />}

      {/*
        ChatPanel is ALWAYS mounted so messages survive navigation.
        The `open` prop controls visual visibility only.
      */}
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
