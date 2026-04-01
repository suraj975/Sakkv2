# Sakk — Firebase Implementation Plan

## Overview

Full Firebase backend for Sakk UAE Plate Marketplace covering:

- **Auth** — Email/password + Google Sign-In (navbar login)
- **Firestore** — All app data (users, plates, bids, watchlist, transactions, gifts)
- **Storage** — User avatars (future: plate ownership docs)
- **Security Rules** — Role-based access per collection

---

## Firestore Collection Schema

### `users/{uid}`

Stores user profile, created automatically on first login.

```ts
{
  uid: string;                // same as Auth UID
  displayName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  emirate?: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ajman" | "RAK" | "Fujairah" | "UAQ";
  isVerified: boolean;        // identity-verified seller
  isTrustedSeller: boolean;
  totalSales: number;
  totalPurchases: number;
  rating: number;             // 0-5, avg of reviews
  reviewCount: number;
  walletBalance: number;      // AED, for escrow deposits
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `plates/{plateId}`

All plate listings — both fixed-price (marketplace) and auction.

```ts
{
  id: string;                 // Firestore auto ID
  code: string;               // e.g. "H", "W", "R"
  num: string;                // plate number e.g. "3010"
  emirate: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ajman" | "RAK" | "Fujairah" | "UAQ";
  type: "gold" | "silver" | "abudhabi" | "sharjah";

  listingType: "fixed" | "auction";
  status: "active" | "sold" | "expired" | "cancelled" | "in_escrow";

  // Fixed price fields
  price: number;              // AED
  origPrice?: number;         // crossed-out original price

  // Auction fields
  startingBid?: number;
  currentBid?: number;
  minBidIncrement?: number;
  bidCount?: number;
  auctionStartTime?: Timestamp;
  auctionEndTime?: Timestamp;
  lotNumber?: number;
  reservePrice?: number;      // hidden reserve

  // Seller info (denorm'd for lists/cards)
  sellerId: string;           // uid
  sellerName: string;
  sellerIsVerified: boolean;

  // Buyer (set when sold)
  buyerId?: string;

  isVerified: boolean;        // plate ownership verified
  views: number;
  watchCount: number;         // how many users watching
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `bids/{bidId}`

Individual bid records for auction plates.

```ts
{
  id: string;
  plateId: string;
  bidderId: string;           // uid
  bidderName: string;         // denorm'd display
  amount: number;             // AED
  isWinning: boolean;
  isOutbid: boolean;
  autoBidMax?: number;        // optional max for auto-bid
  createdAt: Timestamp;
}
```

**Subcollection alternative:** `plates/{plateId}/bids/{bidId}` — both patterns work;
flat `bids` collection used here for easier cross-plate queries (e.g. "my bids").

### `watchlist/{watchId}`

Plates a user is watching — for notifications when price drops or auction nears end.

```ts
{
  id: string;
  userId: string;
  plateId: string;
  plateCode: string; // denorm'd for display
  plateNum: string;
  createdAt: Timestamp;
}
```

### `transactions/{txId}`

Records every completed purchase or escrow event.

```ts
{
  id: string;
  plateId: string;
  sellerId: string;
  buyerId: string;
  amount: number;             // final sale price AED
  escrowFee: number;          // platform fee (e.g. 2%)
  type: "fixed_purchase" | "auction_won" | "gift_redeem";
  status: "pending" | "escrow_held" | "completed" | "disputed" | "refunded";
  escrowReleasedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `gifts/{giftId}`

Digital gift vouchers for plate transfers.

```ts
{
  id: string;
  plateId: string;
  senderId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  code: string;               // unique 8-char redemption code
  status: "pending" | "sent" | "redeemed" | "expired";
  expiresAt: Timestamp;
  redeemedAt?: Timestamp;
  createdAt: Timestamp;
}
```

### `notifications/{notifId}`

In-app notifications per user.

```ts
{
  id: string;
  userId: string;
  type: "outbid" | "auction_ending" | "auction_won" | "price_drop" | "sale_complete" | "gift_received";
  title: string;
  body: string;
  plateId?: string;
  read: boolean;
  createdAt: Timestamp;
}
```

---

## Collection Relationship Diagram

```
users ──────────────────────────────────────────┐
  │                                              │
  ├── sells ──────────► plates ◄── bids ─────── │
  │                       │                     │
  ├── bids ───────────────┘                     │
  │                                             │
  ├── watchlist ──────► plates                  │
  │                                             │
  ├── transactions ───► plates                  │
  │                                             │
  └── gifts ──────────► plates                  │
                                                │
notifications ──────────────────────────────────┘
```

---

## Firebase Security Rules (Firestore)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: only the owner can write their own doc
    match /users/{uid} {
      allow read: if true;
      allow write: if request.auth.uid == uid;
    }

    // Plates: anyone can read; authenticated user can create; only seller can update/delete
    match /plates/{plateId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.sellerId || resource.data.status == "active";
      allow delete: if request.auth.uid == resource.data.sellerId;
    }

    // Bids: anyone can read; only authenticated users can create; no updates
    match /bids/{bidId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }

    // Watchlist: only the owner
    match /watchlist/{watchId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    // Transactions: only buyer or seller can read
    match /transactions/{txId} {
      allow read: if request.auth.uid == resource.data.buyerId
                  || request.auth.uid == resource.data.sellerId;
      allow create: if request.auth != null;
      allow update: if false; // Cloud Functions only
    }

    // Gifts: sender can CRUD; recipient (by email lookup) can read
    match /gifts/{giftId} {
      allow read: if request.auth.uid == resource.data.senderId;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.senderId;
      allow delete: if request.auth.uid == resource.data.senderId;
    }

    // Notifications: only the addressed user
    match /notifications/{notifId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## Implementation Todo List

### Phase 1 — Firebase Foundation

- [x] `src/lib/firebase.ts` — Firebase app init + export `auth`, `db`, `storage`
- [ ] `src/lib/firestore.ts` — typed CRUD helpers for all collections
- [ ] `src/types/firebase.ts` — TypeScript interfaces matching Firestore schema
- [ ] `src/context/AuthContext.tsx` — React context with `useAuth()` hook, listens to `onAuthStateChanged`
- [ ] Add `AuthProvider` to `src/app/layout.tsx`

### Phase 2 — Authentication

- [ ] `src/components/auth/LoginModal.tsx` — modal with Email/Password + Google Sign-In tabs
- [ ] `src/components/auth/UserMenu.tsx` — avatar dropdown shown in navbar when logged in
- [ ] Wire Login button in `Sidebar.tsx` (Profile nav item → open modal if not authed)
- [ ] Wire Login button in `BottomNav.tsx` (Profile tab → open modal if not authed)
- [ ] Auto-create `users/{uid}` doc in Firestore on first login via `onAuthStateChanged`

### Phase 3 — Firestore Helpers

- [ ] `getPlates(filters)` — query `plates` collection with emirate/type/listingType filters
- [ ] `getAuctionPlates()` — active + status=active + listingType=auction, ordered by endTime
- [ ] `getPlateById(id)` — fetch single plate doc
- [ ] `addBid(plateId, amount, userId)` — write bid + update plate's `currentBid`, `bidCount`
- [ ] `addToWatchlist(userId, plateId)` / `removeFromWatchlist`
- [ ] `createTransaction(plateId, buyerId, sellerId, amount, type)`
- [ ] `createGift(plateId, senderId, recipientEmail, message)`
- [ ] `redeemGift(code, userId)`
- [ ] `createPlate(plate, sellerId)` — PostListingModal flow
- [ ] `getUserPlates(userId)` — seller's own listings
- [ ] `getUserBids(userId)` — all bids placed by user

### Phase 4 — Seed Dummy Data

- [ ] `scripts/seed-firebase.ts` — Node script to populate Firestore with:
  - 5 dummy users (Ahmed, Salem, Khalid, Hamad, Fatima)
  - 10 plate listings (mix of fixed + auction, all emirates)
  - 15 bids across auction plates
  - 3 dummy transactions
  - 2 gift vouchers

### Phase 5 — Connect UI to Firestore

- [ ] Replace `PLATES` static array in `page.tsx` with live Firestore query
- [ ] Replace `getAuctionPlates()` in `auctions/page.tsx` with Firestore query
- [ ] Replace `MOCK_BIDS` in bid page with real-time Firestore listener
- [ ] `PostListingModal.tsx` — write to `plates` collection on submit
- [ ] Bid confirm page — write bid to `bids` collection via `addBid()`
- [ ] Checkout page — create `transaction` record
- [ ] Gift page — create `gifts` record

### Phase 6 — Real-Time Listeners

- [ ] Auction plate detail — `onSnapshot` for live bid updates
- [ ] Auction watching page — live countdown + real-time bid feed
- [ ] Notifications bell — `onSnapshot` on `notifications` where `userId==me`

### Phase 7 — User Profile Page

- [ ] `/profile` page — show user's listings, bids, purchases, watchlist
- [ ] Edit profile form — update `users/{uid}` doc

---

## File Structure After Full Implementation

```
src/
  lib/
    firebase.ts          ← done ✅
    firestore.ts         ← Phase 3
    utils.ts
    plates.ts            ← will be replaced by Firestore queries
  types/
    index.ts
    firebase.ts          ← Phase 1
  context/
    AuthContext.tsx      ← Phase 1
  components/
    auth/
      LoginModal.tsx     ← Phase 2
      UserMenu.tsx       ← Phase 2
    layout/
      Sidebar.tsx        ← Phase 2 wire-up
      BottomNav.tsx      ← Phase 2 wire-up
  app/
    layout.tsx           ← Phase 1: wrap with AuthProvider
scripts/
  seed-firebase.ts       ← Phase 4
```

---

## Dummy Seed Users

| Name            | Email            | Role              | Emirate   |
| --------------- | ---------------- | ----------------- | --------- |
| Ahmed Al Rashid | ahmed@sakk.demo  | Seller (Verified) | Dubai     |
| Salem Trading   | salem@sakk.demo  | Seller (Trusted)  | Dubai     |
| Khalid M.       | khalid@sakk.demo | Buyer/Seller      | Abu Dhabi |
| Hamad Al Kaabi  | hamad@sakk.demo  | Buyer             | Abu Dhabi |
| Fatima Al Marri | fatima@sakk.demo | Buyer             | Sharjah   |

All dummy users get password: `Sakk@demo2025`

---

## Notes & Decisions

- **No Analytics in SSR**: `getAnalytics` is browser-only and crashes in Next.js SSR. Excluded from `firebase.ts` — add lazily in client components if needed.
- **Flat `bids` collection** preferred over subcollection so users can query "all my bids" efficiently.
- **Denormalized seller/bidder names** on plate/bid docs so list views avoid extra reads.
- **Seed script** runs as a standalone Node/ts-node script (not inside Next.js), and uses service account or the client SDK with demo credentials.
- **Auto-bid / reserve price** scaffolded in schema but UI implementation is future phase.
