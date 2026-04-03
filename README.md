# Madmoon — UAE Plate Marketplace

🔗 **Live Demo:** [madmoon.vercel.app](https://madmoon.vercel.app/)

<img width="1728" height="964" alt="image" src="https://github.com/user-attachments/assets/c0119f96-c00a-471b-a717-9b54539e7ad9" />


**Madmoon** is a premium digital marketplace for buying, selling, auctioning, and gifting UAE vehicle license plates. It serves collectors, investors, and everyday drivers across all seven emirates, providing a trusted, end-to-end platform with built-in escrow protection and real-time auctions.

---

## What is Madmoon?

UAE number plates are a unique asset class — rare combinations can sell for millions of dirhams. Today, this market is fragmented across social media, word-of-mouth, and unprotected private deals. Sakk brings transparency, trust, and a seamless digital experience to this market.

**Core value propositions:**

- **Buyers** get verified listings, market price data, and escrow-protected payments.
- **Sellers** get reach, a credible sales channel, and instant AI-powered valuations.
- **Gifters** can transfer plate ownership to a recipient via a smooth digital gift flow with Madmoon's gift flow.

---

## Key Features

| Feature             | Description                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Marketplace**     | Browse and search plates across all emirates with filters by emirate, type, price range, and character/number combinations |
| **Live Auctions**   | Real-time bidding with countdown timers, auto-bid support, outbid notifications, and lot-based auction sessions            |
| **Plate Estimator** | AI-powered instant valuation with comparable sales and market trend data — no registration required                        |
| **Escrow Checkout** | Multi-step secure checkout: payment selection → escrow hold → ownership transfer → confirmed                               |
| **Gift Flow**       | Send a plate as a gift; recipient receives a branded reveal page and accepts via TCF number                                |
| **Seller Profiles** | Verified seller badges, ratings, and transaction history to build buyer confidence                                         |
| **Notifications**   | Real-time alerts for outbid events, auction wins, price drops, and watchlist activity                                      |

---

## User Journeys

### Buyer — Fixed Price

`Search / Browse → Plate Detail → Add to Watchlist or Buy → Checkout → Escrow Hold → Ownership Transfer Confirmed`

### Buyer — Auction

`Live Auctions feed → Place Bid → Watch (Outbid / Winning) → Win → Proceed to Checkout → Escrow → Transfer`

### Seller

`Post Listing (fixed price or auction) → Set price/reserve → Manage active listings → Receive payment post-transfer`

### Gifter

`Select plate → Gift Setup → Gift Checkout → Recipient gets Reveal page → Accept via TCF number`

---

## Product Screens

| Screen        | Purpose                                                 |
| ------------- | ------------------------------------------------------- |
| Home          | Hero, flash deals, live auctions strip, trending plates |
| Auctions      | Full auction listings with live/upcoming/ended states   |
| Plate Detail  | Market analysis, seller card, escrow info, bid/buy CTA  |
| Bid Page      | Enter bid amount, binding bid confirmation              |
| Watching      | Live countdown, bid history, outbid state               |
| Auction Won   | Win confirmation, proceed to payment                    |
| Checkout      | Payment method selection, financial summary             |
| Escrow        | Timeline tracker for ownership transfer steps           |
| Estimator     | Instant plate valuation with comparable sales           |
| Gift Flow     | Gift setup, checkout, and recipient reveal page         |
| Profile       | User listings, purchase history, watchlist              |
| Notifications | Activity feed for bids, price changes, wins             |

---

## Trust & Safety

- **Escrow protection** on all transactions — funds held until ownership transfer is confirmed
- **Verified seller badges** — identity-verified sellers are visually distinguished
- **Plate ownership verification** — each listing can carry a verification status
- **TCF-based gift transfers** — recipient must confirm via their Traffic File Card number

---

## Tech Stack

| Layer          | Choice                                     |
| -------------- | ------------------------------------------ |
| Framework      | Next.js 16 (App Router, SSR/SSG)           |
| Frontend       | React 19, TypeScript 5                     |
| Styling        | Tailwind CSS v4 + Material Design 3 tokens |
| Backend / Auth | Firebase (Firestore, Auth, Storage)        |
| Icons          | Lucide React                               |
| Deployment     | Vercel-ready                               |

---

## Current Status

The application is a **functional prototype** with:

- All UI screens built and navigable (mobile + desktop)
- Firebase backend schema designed (users, plates, bids, watchlists, transactions, gifts)
- Auth flow (email/password + Google Sign-In) implemented
- Auction feature screens live (bid, watching, won)
- Escrow checkout flow end-to-end

**Next milestones:**

- Live real-time bid synchronisation via Firestore listeners
- Push notifications for auction events
- Seller listing management dashboard
- Payment gateway integration

---

## Getting Started (Development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm run start    # serve production build
npm run lint     # run ESLint
```
