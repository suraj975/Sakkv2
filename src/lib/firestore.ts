/**
 * Typed Firestore helpers for Sakk.
 * All functions return plain objects (id field injected from doc.id).
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  runTransaction,
  type Query,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  FSPlate,
  FSBid,
  FSWatchlistItem,
  FSTransaction,
  FSGift,
  FSNotification,
  FSUser,
  ListingType,
  PlateTypeFS,
  Emirate,
} from "@/types/firebase";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function withId<T>(snap: { id: string; data: () => DocumentData }): T {
  return { id: snap.id, ...snap.data() } as T;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<FSUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? withId<FSUser>(snap) : null;
}

export async function updateUser(
  uid: string,
  data: Partial<FSUser>,
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── Plates ───────────────────────────────────────────────────────────────────

export interface PlateFilters {
  listingType?: ListingType;
  emirate?: Emirate;
  type?: PlateTypeFS;
  status?: FSPlate["status"];
  limitCount?: number;
}

export async function getPlates(
  filters: PlateFilters = {},
): Promise<FSPlate[]> {
  let q: Query<DocumentData> = collection(db, "plates");
  const constraints = [];

  constraints.push(where("status", "==", filters.status ?? "active"));

  if (filters.listingType) {
    constraints.push(where("listingType", "==", filters.listingType));
  }
  if (filters.emirate) {
    constraints.push(where("emirate", "==", filters.emirate));
  }
  if (filters.type) {
    constraints.push(where("type", "==", filters.type));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (filters.limitCount) {
    constraints.push(limit(filters.limitCount));
  }

  q = query(collection(db, "plates"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<FSPlate>(d));
}

export async function getAuctionPlates(): Promise<FSPlate[]> {
  const q = query(
    collection(db, "plates"),
    where("status", "==", "active"),
    where("listingType", "==", "auction"),
    orderBy("auctionEndTime", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<FSPlate>(d));
}

export async function getPlateById(id: string): Promise<FSPlate | null> {
  const snap = await getDoc(doc(db, "plates", id));
  return snap.exists() ? withId<FSPlate>(snap) : null;
}

export async function createPlate(
  plate: Omit<
    FSPlate,
    "id" | "createdAt" | "updatedAt" | "views" | "watchCount"
  >,
): Promise<string> {
  const ref = await addDoc(collection(db, "plates"), {
    ...plate,
    views: 0,
    watchCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePlate(
  id: string,
  data: Partial<FSPlate>,
): Promise<void> {
  await updateDoc(doc(db, "plates", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getUserPlates(sellerId: string): Promise<FSPlate[]> {
  const q = query(
    collection(db, "plates"),
    where("sellerId", "==", sellerId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<FSPlate>(d));
}

/** Real-time listener for a single plate */
export function subscribePlate(
  id: string,
  onData: (plate: FSPlate | null) => void,
): Unsubscribe {
  return onSnapshot(doc(db, "plates", id), (snap) => {
    onData(snap.exists() ? withId<FSPlate>(snap) : null);
  });
}

// ─── Bids ─────────────────────────────────────────────────────────────────────

export async function getBidsForPlate(plateId: string): Promise<FSBid[]> {
  const q = query(
    collection(db, "bids"),
    where("plateId", "==", plateId),
    orderBy("amount", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<FSBid>(d));
}

export async function getUserBids(userId: string): Promise<FSBid[]> {
  const q = query(
    collection(db, "bids"),
    where("bidderId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<FSBid>(d));
}

/**
 * Place a bid — atomically:
 *  1. Marks previous winning bid as outbid
 *  2. Writes new bid as winning
 *  3. Updates plate currentBid and bidCount
 */
export async function placeBid(
  plateId: string,
  bidderId: string,
  bidderName: string,
  amount: number,
): Promise<void> {
  const plateRef = doc(db, "plates", plateId);

  await runTransaction(db, async (tx) => {
    const plateSnap = await tx.get(plateRef);
    if (!plateSnap.exists()) throw new Error("Plate not found");

    const plate = plateSnap.data() as FSPlate;
    if (plate.status !== "active" || plate.listingType !== "auction") {
      throw new Error("Auction is not active");
    }

    const minBid = (plate.currentBid ?? 0) + (plate.minBidIncrement ?? 0);
    if (amount < minBid) {
      throw new Error(`Bid must be at least AED ${minBid.toLocaleString()}`);
    }

    // Mark previous winning bid as outbid
    const prevBidsQ = query(
      collection(db, "bids"),
      where("plateId", "==", plateId),
      where("isWinning", "==", true),
    );
    const prevSnap = await getDocs(prevBidsQ);
    for (const prevDoc of prevSnap.docs) {
      tx.update(prevDoc.ref, { isWinning: false, isOutbid: true });
    }

    // Write new bid
    const newBidRef = doc(collection(db, "bids"));
    tx.set(newBidRef, {
      plateId,
      bidderId,
      bidderName,
      amount,
      isWinning: true,
      isOutbid: false,
      createdAt: serverTimestamp(),
    });

    // Update plate
    tx.update(plateRef, {
      currentBid: amount,
      bidCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  });
}

/** Real-time bid feed for a plate */
export function subscribeBids(
  plateId: string,
  onData: (bids: FSBid[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, "bids"),
    where("plateId", "==", plateId),
    orderBy("amount", "desc"),
    limit(20),
  );
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => withId<FSBid>(d)));
  });
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

export async function getWatchlist(userId: string): Promise<FSWatchlistItem[]> {
  const q = query(
    collection(db, "watchlist"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<FSWatchlistItem>(d));
}

export async function isWatching(
  userId: string,
  plateId: string,
): Promise<boolean> {
  const q = query(
    collection(db, "watchlist"),
    where("userId", "==", userId),
    where("plateId", "==", plateId),
    limit(1),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function addToWatchlist(
  userId: string,
  plate: Pick<FSPlate, "id" | "code" | "num">,
): Promise<void> {
  const ref = doc(collection(db, "watchlist"));
  await setDoc(ref, {
    userId,
    plateId: plate.id,
    plateCode: plate.code,
    plateNum: plate.num,
    createdAt: serverTimestamp(),
  });
  // Increment watchCount on plate
  await updateDoc(doc(db, "plates", plate.id!), {
    watchCount: increment(1),
  });
}

export async function removeFromWatchlist(
  userId: string,
  plateId: string,
): Promise<void> {
  const q = query(
    collection(db, "watchlist"),
    where("userId", "==", userId),
    where("plateId", "==", plateId),
  );
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    await deleteDoc(d.ref);
  }
  await updateDoc(doc(db, "plates", plateId), {
    watchCount: increment(-1),
  });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function createTransaction(
  tx: Omit<FSTransaction, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const ref = await addDoc(collection(db, "transactions"), {
    ...tx,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserTransactions(
  userId: string,
): Promise<FSTransaction[]> {
  // Buyer side
  const buyerQ = query(
    collection(db, "transactions"),
    where("buyerId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  // Seller side
  const sellerQ = query(
    collection(db, "transactions"),
    where("sellerId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const [buyerSnap, sellerSnap] = await Promise.all([
    getDocs(buyerQ),
    getDocs(sellerQ),
  ]);
  const all = [
    ...buyerSnap.docs.map((d) => withId<FSTransaction>(d)),
    ...sellerSnap.docs.map((d) => withId<FSTransaction>(d)),
  ];
  // Deduplicate by id
  const seen = new Set<string>();
  return all.filter((t) => {
    if (seen.has(t.id!)) return false;
    seen.add(t.id!);
    return true;
  });
}

// ─── Gifts ────────────────────────────────────────────────────────────────────

function generateGiftCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SAKK-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createGift(
  plateId: string,
  senderId: string,
  opts: { recipientEmail?: string; recipientPhone?: string; message?: string },
): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const ref = await addDoc(collection(db, "gifts"), {
    plateId,
    senderId,
    recipientEmail: opts.recipientEmail ?? null,
    recipientPhone: opts.recipientPhone ?? null,
    message: opts.message ?? null,
    code: generateGiftCode(),
    status: "sent",
    expiresAt,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function redeemGift(
  code: string,
  userId: string,
): Promise<FSGift | null> {
  const q = query(
    collection(db, "gifts"),
    where("code", "==", code.toUpperCase()),
    where("status", "==", "sent"),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const giftDoc = snap.docs[0];
  const gift = withId<FSGift>(giftDoc);

  await updateDoc(giftDoc.ref, {
    status: "redeemed",
    redeemedAt: serverTimestamp(),
  });

  // Transfer plate ownership
  await updateDoc(doc(db, "plates", gift.plateId), {
    buyerId: userId,
    status: "sold",
    updatedAt: serverTimestamp(),
  });

  return gift;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(
  userId: string,
): Promise<FSNotification[]> {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(30),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<FSNotification>(d));
}

export async function markNotificationRead(notifId: string): Promise<void> {
  await updateDoc(doc(db, "notifications", notifId), { read: true });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("read", "==", false),
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => updateDoc(d.ref, { read: true })));
}

/** Real-time unread notification count */
export function subscribeUnreadCount(
  userId: string,
  onCount: (n: number) => void,
): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("read", "==", false),
  );
  return onSnapshot(q, (snap) => onCount(snap.size));
}

// ─── Plate view tracking ──────────────────────────────────────────────────────

export async function incrementPlateViews(plateId: string): Promise<void> {
  await updateDoc(doc(db, "plates", plateId), {
    views: increment(1),
  });
}
