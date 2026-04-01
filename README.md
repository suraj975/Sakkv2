# Sakk — UAE Plate Marketplace

A full-stack Next.js marketplace for buying, selling, and gifting UAE vehicle license plates. Built with Material Design 3 tokens, glassmorphism navigation, and a full escrow-protected checkout flow.

---

## Screenshots

| Home                                            | Plate Detail                                            | Checkout                                                | Estimator                                             |
| ----------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| Mobile-first hero, flash deals, trending plates | Dark gradient hero, market analysis slider, seller card | Financial summary, payment method selection, escrow CTA | AI-driven valuation, market metrics, comparable sales |

---

## Features

- **Marketplace** — Browse and search UAE number plates across all emirates
- **Plate Detail** — Market analysis, seller info, escrow protection info
- **Checkout** — Multi-step: payment selection → escrow hold → transfer → confirmed
- **Gift Flow** — Gift a plate to someone with TCF number–based ownership transfer
- **Estimator** — Instant AI-driven plate valuation with market metrics and comparable sales
- **Gift Reveal** — Recipient-facing reveal page with TCF acceptance flow
- **Responsive** — Mobile-first with a full desktop layout (sidebar + multi-column grids)

---

## Tech Stack

| Layer     | Choice                                         |
| --------- | ---------------------------------------------- |
| Framework | Next.js 16.2.2 (App Router)                    |
| UI        | React 19.2.4                                   |
| Styling   | Tailwind CSS v4 + Material Design 3 CSS tokens |
| Icons     | Lucide React                                   |
| Language  | TypeScript 5                                   |
| Linting   | ESLint (eslint-config-next)                    |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build    # production build
npm run start    # serve production build
npm run lint     # run ESLint
```

---

## Project Structure

```
src/
├── app/
│   ├── globals.css                  # MD3 CSS tokens + Tailwind @theme
│   ├── layout.tsx                   # Root layout with AppShell
│   ├── page.tsx                     # Home / Marketplace
│   ├── search/page.tsx              # Search & filter
│   ├── estimator/page.tsx           # Plate value estimator
│   ├── gift/reveal/page.tsx         # Gift recipient reveal page
│   └── plates/[id]/
│       ├── page.tsx                 # Plate detail
│       ├── checkout/
│       │   ├── page.tsx             # Payment & checkout
│       │   ├── escrow/page.tsx      # Escrow status & timeline
│       │   └── complete/page.tsx    # Transfer confirmed
│       └── gift/
│           ├── page.tsx             # Gift a plate
│           ├── setup/page.tsx       # Gift setup
│           └── checkout/page.tsx    # Gift checkout
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx             # Mobile/desktop shell switcher
│   │   ├── BottomNav.tsx            # Mobile bottom tab bar
│   │   ├── Sidebar.tsx              # Desktop left sidebar
│   │   └── PageHeader.tsx           # Back-button sub-page header
│   ├── plates/
│   │   ├── PlateViz.tsx             # Pixel-accurate licence plate visual
│   │   └── PlateCard.tsx            # Grid listing card
│   └── ui/
│       ├── Hero.tsx, Logo.tsx, Pill.tsx, TLine.tsx
│       ├── IBox.tsx, InfoBox.tsx
└── lib/
│   └── plates.ts                    # Plate data, aed(), escrowFee(), priceTier()
└── types/
    └── index.ts                     # Plate, PlateType, PlateSize
```

---

## Routes

| Route                            | Page                                             |
| -------------------------------- | ------------------------------------------------ |
| `/`                              | Home / Marketplace                               |
| `/search`                        | Search & filter plates                           |
| `/plates/[id]`                   | Plate detail                                     |
| `/plates/[id]/checkout`          | Checkout                                         |
| `/plates/[id]/checkout/escrow`   | Escrow status                                    |
| `/plates/[id]/checkout/complete` | Transfer confirmed                               |
| `/plates/[id]/gift`              | Gift a plate                                     |
| `/plates/[id]/gift/setup`        | Gift setup                                       |
| `/plates/[id]/gift/checkout`     | Gift checkout                                    |
| `/gift/reveal`                   | Gift reveal (recipient) — `?plateId=&from=&msg=` |
| `/estimator`                     | Plate value estimator                            |

---

## Design System

Tokens are defined as CSS custom properties in `src/app/globals.css` and mapped into Tailwind via `@theme inline`.

### Key tokens

| Token                        | Value     | Usage                                      |
| ---------------------------- | --------- | ------------------------------------------ |
| `--primary`                  | `#006A66` | Dark teal — buttons, active states, prices |
| `--primary-container`        | `#0CBFB8` | Light teal — gradient endpoint, chips      |
| `--tertiary`                 | `#006E2D` | Green — positive indicators                |
| `--surface`                  | `#F8FAFB` | Page background                            |
| `--surface-container-lowest` | `#FFFFFF` | Card backgrounds                           |
| `--surface-container-low`    | `#F2F4F5` | Input backgrounds                          |
| `--on-surface`               | `#191C1D` | Primary text                               |
| `--on-surface-variant`       | `#3C4948` | Secondary text                             |
| `--teal-dark`                | `#063D3A` | Hero / dark header backgrounds             |

### Design rules

- **No 1px borders** — use tonal background shifts (e.g. `surface-container-low` vs `surface-container-lowest`) or `outline` for selected states
- **Cards** — `surface-container-lowest` background + `0 4px 18px rgba(25,28,29,0.08)` ambient shadow, `rounded-2xl`
- **Primary buttons** — `linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)`
- **Glass headers** — `rgba(248,250,251,0.85)` + `backdrop-filter: blur(20px)`
- **Chips / pills** — `rounded-full`

### Utility classes

| Class               | Effect                       |
| ------------------- | ---------------------------- |
| `.ambient-shadow`   | Subtle card shadow           |
| `.plate-viz-shadow` | Shadow for plate visuals     |
| `.glass-nav`        | Glassmorphism navigation bar |
| `.btn-gradient`     | Teal gradient button         |

---

## Responsive Layout

- **Mobile (`< lg`)** — Single column, `BottomNav`, sticky CTAs at bottom
- **Desktop (`lg+`)** — `Sidebar` (200px) + content area, multi-column grids, no `BottomNav`

The `AppShell` component handles the mobile phone-frame wrapper on desktop for demo purposes.

---

## Data

Plate data lives in `src/lib/plates.ts` as a static array. Utility functions:

```ts
aed(price: number): string          // → "AED 89,000"
escrowFee(price: number): number    // tiered fee (1–3%)
priceTier(price: number): string    // → "Standard" | "Premium" | "Elite"
getPlateById(id: string): Plate     // lookup by string id
```
