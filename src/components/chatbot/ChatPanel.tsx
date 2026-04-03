"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import ChatMessage, { TypingIndicator, parseNavAction } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { getQuickReplies } from "@/lib/chatbot/knowledge-base";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatPanel({ open, onClose }: ChatPanelProps) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const quickReplies = getQuickReplies(pathname);

  // Welcome message on mount
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm Madmoon AI — your guide to the Madmoon marketplace. I can help with buying, selling, auctions, gifting plates, and more. What would you like to know?",
      },
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setShowQuickReplies(false);
      setInput("");

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            currentPage: pathname,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Unknown error");
        }

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "Sorry, I couldn't get a response right now. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, pathname],
  );

  return (
    <div style={{ display: open ? "contents" : "none" }}>
      {/* Backdrop (mobile only) */}
      <div
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl md:bottom-6 md:left-auto md:right-6 md:h-150 md:w-96 md:rounded-2xl"
        style={{
          background: "var(--background)",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.18)",
          minHeight: "60dvh",
          maxHeight: "85dvh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 rounded-t-2xl px-4 py-3"
          style={{ background: "var(--teal-darker)" }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "var(--teal)" }}
          >
            M
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Madmoon AI</p>
            <p className="text-xs text-teal-300">Always here to help</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3"
          style={{ background: "var(--sakk-bg)" }}
        >
          {messages.map((msg) => {
            const { cleaned, nav } = parseNavAction(msg.content);
            return (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={cleaned}
                navAction={nav}
              />
            );
          })}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick Replies */}
        {showQuickReplies && messages.length <= 1 && (
          <div
            className="flex flex-wrap gap-2 border-t px-4 py-3"
            style={{
              borderColor: "var(--sakk-border)",
              background: "var(--sakk-bg)",
            }}
          >
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                disabled={loading}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
                style={{
                  borderColor: "var(--teal)",
                  color: "var(--teal)",
                }}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => sendMessage(input)}
          disabled={loading}
        />
      </div>
    </div>
  );
}
