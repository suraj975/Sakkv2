import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a Firestore Timestamp, ISO string, or undefined to an ISO string */
export function toISOString(
  value: Timestamp | string | null | undefined,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.toDate().toISOString();
}
