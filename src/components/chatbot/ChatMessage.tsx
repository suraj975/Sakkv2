"use client";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface NavAction {
  path: string;
  label: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  navAction?: NavAction | null;
}

/** Parse <nav>{"path":"/foo","label":"Bar"}</nav> from AI reply */
export function parseNavAction(text: string): {
  cleaned: string;
  nav: NavAction | null;
} {
  const match = text.match(/<nav>([\s\S]*?)<\/nav>/);
  if (!match) return { cleaned: text, nav: null };

  try {
    const nav = JSON.parse(match[1]) as NavAction;
    const cleaned = text.replace(/<nav>[\s\S]*?<\/nav>/, "").trim();
    return { cleaned, nav };
  } catch {
    return { cleaned: text, nav: null };
  }
}

export default function ChatMessage({
  role,
  content,
  navAction,
}: ChatMessageProps) {
  const router = useRouter();
  const isUser = role === "user";

  function handleNav() {
    if (navAction) {
      router.push(navAction.path);
    }
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div
          className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: "var(--teal)" }}
        >
          M
        </div>
      )}
      <div
        className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser ? "rounded-br-sm text-white" : "rounded-bl-sm border"
          }`}
          style={
            isUser
              ? { background: "var(--teal)" }
              : {
                  background: "var(--sakk-card)",
                  borderColor: "var(--sakk-border)",
                  color: "var(--sakk-text)",
                }
          }
        >
          {isUser ? (
            // User messages: plain text, preserve line breaks
            content.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < content.split("\n").length - 1 && <br />}
              </span>
            ))
          ) : (
            // Assistant messages: render markdown
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-1 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => (
                  <ul className="mb-1 ml-4 list-disc space-y-0.5">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-1 ml-4 list-decimal space-y-0.5">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                code: ({ children }) => (
                  <code
                    className="rounded px-1 py-0.5 text-xs font-mono"
                    style={{ background: "var(--sakk-bg)" }}
                  >
                    {children}
                  </code>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>

        {navAction && (
          <button
            onClick={handleNav}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-teal-50"
            style={{
              borderColor: "var(--teal)",
              color: "var(--teal)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            {navAction.label}
          </button>
        )}
      </div>
    </div>
  );
}

/** Skeleton typing indicator */
export function TypingIndicator() {
  return (
    <div className="mb-3 flex items-start">
      <div
        className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ background: "var(--teal)" }}
      >
        M
      </div>
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-sm border px-4 py-3"
        style={{
          background: "var(--sakk-card)",
          borderColor: "var(--sakk-border)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              background: "var(--teal)",
              animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
