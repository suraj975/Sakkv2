"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ArrowLeft,
  CheckCheck,
  TrendingUp,
  Hammer,
  Gift,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/firestore";
import type { FSNotification } from "@/types/firebase";
import { Timestamp } from "firebase/firestore";

function relativeTime(ts: Timestamp | undefined): string {
  if (!ts) return "";
  const diff = Date.now() - ts.toMillis();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotifIcon({ type }: { type: string }) {
  const base =
    "w-10 h-10 rounded-full flex items-center justify-center shrink-0";
  if (type === "outbid")
    return (
      <div className={base} style={{ background: "rgba(186,26,26,0.12)" }}>
        <TrendingUp size={18} style={{ color: "var(--error)" }} />
      </div>
    );
  if (type === "auction_won")
    return (
      <div className={base} style={{ background: "rgba(0,110,45,0.12)" }}>
        <Hammer size={18} style={{ color: "var(--tertiary)" }} />
      </div>
    );
  if (type === "auction_ending")
    return (
      <div className={base} style={{ background: "rgba(217,119,6,0.12)" }}>
        <Bell size={18} style={{ color: "#D97706" }} />
      </div>
    );
  if (type === "gift")
    return (
      <div className={base} style={{ background: "rgba(139,92,246,0.12)" }}>
        <Gift size={18} style={{ color: "#7C3AED" }} />
      </div>
    );
  return (
    <div className={base} style={{ background: "rgba(0,106,102,0.12)" }}>
      <BadgeCheck size={18} style={{ color: "var(--primary)" }} />
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notifs, setNotifs] = useState<FSNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    if (!user) {
      Promise.resolve().then(() => {
        if (active) setLoading(false);
      });
      return () => {
        active = false;
      };
    }
    getNotifications(user.uid).then((n) => {
      if (active) {
        setNotifs(n);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  const handleMarkRead = async (notif: FSNotification) => {
    if (notif.read || !notif.id) return;
    await markNotificationRead(notif.id);
    setNotifs((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAll = async () => {
    if (!user) return;
    setMarkingAll(true);
    await markAllNotificationsRead(user.uid);
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    setMarkingAll(false);
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--surface)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 glass-nav flex items-center justify-between px-4 lg:px-8 h-14 lg:h-16"
        style={{ borderBottom: "1px solid rgba(187,202,199,0.15)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ color: "var(--on-surface)", background: "transparent" }}
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <span
          className="font-black text-base"
          style={{ color: "var(--on-surface)" }}
        >
          Notifications
          {unreadCount > 0 && (
            <span
              className="ml-2 text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: "var(--error)", color: "white" }}
            >
              {unreadCount}
            </span>
          )}
        </span>
        {unreadCount > 0 ? (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            className="flex items-center gap-1.5 text-xs font-bold cursor-pointer border-none bg-transparent"
            style={{ color: "var(--primary)" }}
          >
            {markingAll ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCheck size={14} />
            )}
            Mark all read
          </button>
        ) : (
          <div className="w-24" />
        )}
      </header>

      <div className="max-w-2xl mx-auto pb-24 lg:pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              size={28}
              className="animate-spin"
              style={{ color: "var(--outline)" }}
            />
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <Bell
              size={48}
              strokeWidth={1.2}
              style={{ color: "var(--outline)" }}
              className="mb-4"
            />
            <p
              className="font-bold text-base mb-1"
              style={{ color: "var(--on-surface)" }}
            >
              Sign in to see notifications
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              You&apos;ll be notified about bids, auctions ending, and more.
            </p>
          </div>
        ) : notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <Bell
              size={48}
              strokeWidth={1.2}
              style={{ color: "var(--outline)" }}
              className="mb-4"
            />
            <p
              className="font-bold text-base mb-1"
              style={{ color: "var(--on-surface)" }}
            >
              All caught up
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              You have no notifications yet.
            </p>
          </div>
        ) : (
          <div>
            {notifs.map((notif, i) => (
              <button
                key={notif.id ?? i}
                onClick={() => handleMarkRead(notif)}
                className="w-full flex items-start gap-3 px-4 py-4 text-left cursor-pointer border-none"
                style={{
                  background: notif.read
                    ? "transparent"
                    : "rgba(0,106,102,0.04)",
                  borderBottom: "1px solid rgba(187,202,199,0.1)",
                  fontFamily: "inherit",
                }}
              >
                <NotifIcon type={notif.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="text-sm font-bold leading-snug"
                      style={{ color: "var(--on-surface)" }}
                    >
                      {notif.title}
                    </p>
                    <span
                      className="text-[10px] shrink-0 mt-0.5"
                      style={{ color: "var(--outline)" }}
                    >
                      {relativeTime(notif.createdAt as Timestamp)}
                    </span>
                  </div>
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {notif.body}
                  </p>
                </div>
                {!notif.read && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                    style={{ background: "var(--primary)" }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
