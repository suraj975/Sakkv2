"use client";

interface ChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export default function ChatButton({ onClick, hasUnread }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open صك chat"
      className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 md:bottom-6"
      style={{ background: "var(--teal)" }}
    >
      {/* Chat icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {hasUnread && (
        <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
      )}
    </button>
  );
}
