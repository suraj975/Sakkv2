# Sakk — Auction Feature Design Specification

## For Google Stitch Screen Design

> **Context:** This document describes all new and modified screens for the Auction feature added to the Sakk UAE plate marketplace. Use the same design system as `STITCH_DESIGN_PROMPT.md` for all shared tokens, typography, and components.

---

## AUCTION FEATURE OVERVIEW

Auction is a new **listing type** alongside fixed-price. Sellers set a starting bid and a duration. Buyers compete in real-time. The highest bidder at closing pays via the existing escrow system — no new payment infrastructure required.

### Additional Colour Tokens (Auction-specific)

| Token      | Hex       | Usage                                         |
| ---------- | --------- | --------------------------------------------- |
| Red        | `#DC2626` | Countdown when < 1 hour remaining, validation |
| Red BG     | `#FEF2F2` | Countdown card background when < 1 hour       |
| Amber      | `#D97706` | Outbid warning state, binding bid notice      |
| Amber BG   | `#FFFBEB` | Outbid banner, binding notice background      |
| Live Green | `#16A34A` | Pulsing "LIVE" dot on auction cards           |

---

## FULL FLOW — Navigation Tree

```
/ (Home — modified)
  └── "Live Auctions" section (horizontal scroll strip)
        └── Auction PlateCard → /plates/[id]

/auctions  ← NEW PAGE
  └── Auction PlateCard → /plates/[id]

/plates/[id]  ← MODIFIED (conditional: shows auction UI if listingType === "auction")
  └── "Place a Bid" button → /plates/[id]/auction/bid

/plates/[id]/auction/bid  ← NEW PAGE
  └── "Confirm Bid" button → /plates/[id]/auction/watching

/plates/[id]/auction/watching  ← NEW PAGE
  ├── State A: "Highest Bidder" — shows countdown + bid history
  └── State B: "Outbid" — "Bid Again" → back to /plates/[id]/auction/bid

  (When auction closes and user has won)
  └── /plates/[id]/auction/won  ← NEW PAGE
        └── "Proceed to Payment" → /plates/[id]/checkout  (EXISTING, unchanged)
              └── /plates/[id]/checkout/escrow  (EXISTING, unchanged)
                    └── /plates/[id]/checkout/complete  (EXISTING, unchanged)
```

---

## MODIFIED: HOME PAGE `"/"`

### New "Live Auctions" Section

Insert this section **between the Stats Row and the Trending Plates section**.

**Section Header Row:**

- Left: small pulsing red dot (6px circle, `animate-ping`) + "Live Auctions" in bold 15px dark text
- Right: "View all" teal link → navigates to `/auctions`

**Content — Mobile (horizontal scroll):**

- Single horizontally scrollable row of Auction PlateCards
- Cards are ~160px wide with right peek showing partial next card
- Scroll snap on each card, no scrollbar visible

**Content — Desktop (4-column grid):**

- Same grid as Trending Plates
- Shows up to 4 auction cards

---

## AUCTION PLATECARD VARIANT

> Used on the Home "Live Auctions" section and the `/auctions` page. Same white card base as the existing PlateCard but with auction-specific info replacing the price.

**Card structure (white card, 12px radius, hover lift — identical base):**

1. **"LIVE" badge** — absolute top-right corner
   - Tiny pill: pulsing green dot (5px, `animate-ping`) + "LIVE" text (9px bold uppercase)
   - Background: teal-light, border: teal, text: teal-dark

2. **PlateViz `sm`** — centred, same as normal card

3. **Emirate · Code label** — grey 11px (e.g. "Dubai · H")

4. **"Current Bid" Row:**
   - "CURRENT BID" label in grey 9px uppercase tracking-widest
   - "AED 47,500" bold 15px teal-dark

5. **Countdown Row:**
   - Clock icon (12px) + countdown text
   - **Normal (> 1h remaining):** grey icon + grey text — "2d 14h"
   - **Urgent (< 1h remaining):** red icon + red bold text — "42m 11s", wrapped in a red-bg pill

6. **Footer caption:** "12 bids" in grey 10px

> ⚠️ No static price shown. No "Verified" badge on the card (shown on detail page).

---

## NEW PAGE 1 — Auctions Browse

**Route:** `/auctions`
**Purpose:** Dedicated page to browse all live auction listings.

---

### Mobile Layout (top to bottom)

**1. Page Header**

- White bar, back arrow (← on mobile), title: "Live Auctions"
- Right side: teal-light pill showing live count — "24 live" (teal text, 10px)

**2. Filter Tab Row** (sticky, white, 1px bottom border)

- 3 tabs: **Ending Soon** | **Newly Listed** | **All**
- Active tab: teal text + 2px teal bottom border underline
- Inactive: grey text, no underline
- Sticks below the page header on scroll

**3. Urgency Banner** (shown on "Ending Soon" tab only)

- Amber background `#FFFBEB`, 4px amber left accent border
- Clock icon (amber) + "5 plates ending in the next hour — bid now" (12px amber-dark)

**4. Auction Plate Grid**

- 2 columns mobile / 4 columns desktop
- Each cell: **Auction PlateCard Variant** (described above)
- Sorted by: shortest time remaining (Ending Soon tab), newest first (Newly Listed tab)

**5. Empty State** (if no auctions):

- Centred layout: Hammer icon (teal 40px) + "No live auctions right now" heading (14px semi-bold) + "Check back soon or browse fixed-price plates" (12px grey) + teal "Browse Marketplace" button

---

### Desktop Differences

- No back arrow; "Live Auctions" becomes H1 heading with subtitle: "Bid on exclusive UAE number plates"
- Grid: 4 columns (xl: 5 columns)
- Urgency banner becomes a sticky floating card on the right side of the screen

---

## MODIFIED PAGE — Plate Detail (Auction State)

**Route:** `/plates/[id]`
**Condition:** Only when `listingType === "auction"`
**Purpose:** Same URL as fixed-price detail — the page detects listing type and conditionally renders auction UI in place of the standard Buy/Gift section.

> The **Page Header** and **Plate Hero** (full-width teal-dark background with PlateViz lg + badge pills) are **identical** to the existing Plate Detail. Only the content below the hero changes.

---

### Changed: Price / Auction Status Block

**Row 1 — Auction Status Bar** (flex, space-between):

- Left: "CURRENT BID" label (11px grey uppercase tracking-widest)
- Right: "LIVE" pill badge (pulsing green dot + "LIVE" text, same as PlateCard)

**Row 2 — Current Bid Amount:**

- "AED 47,500" — 26px bold dark (same size as fixed-price)
- Below: "+ AED 1,500 escrow fee · Upper-mid tier" grey 12px (same as fixed-price caption)

**Row 3 — Bid Meta** (grey 12px, flex row, gap 16px):

- "↑ 12 bids" (ArrowUp icon 12px + count)
- "Starting bid AED 30,000" (grey caption)

---

### Changed: Countdown Card (new, replaces Market Price Analysis)

White card, rounded-xl, border.

- Header label: "AUCTION ENDS IN" (11px grey uppercase tracking-widest)
- **Large countdown display:** numbers in bold 22px monospace teal-dark
  - Format: `1d  14h  22m  11s`
  - Each unit has a tiny label below: "days / hrs / min / sec" in 9px grey
  - Digits separated by `:` colons in grey

- **Urgent state (< 1 hour):**
  - All countdown digits turn red `#DC2626`
  - Card border: 1px solid `#DC2626`
  - Card background tint: `#FEF2F2`

- Small caption below countdown: "Auction started 2 days ago" — grey 11px

---

### Changed: CTA Buttons (replaces "Buy Now" + "Gift this Plate")

**Primary CTA — "Place a Bid":**

- Full-width teal button
- Hammer icon (left) + "Place a Bid — from AED 49,000" (min next bid shown inline)
- Routes to: `/plates/[id]/auction/bid`

**Secondary CTA — "Watch Auction":**

- White card background, grey border
- Eye icon + "Watch Auction" text
- Visual only in prototype (greyed, non-functional)

> Gift button is **not shown** for auction listings.

---

### New: Bid History Accordion (below CTAs)

White card, rounded-xl, collapsible.

- **Header row:** "Bid History" (13px semi-bold) + bid count badge (teal pill "12 bids") + ChevronDown/Up icon on far right
- **Default state:** collapsed (only header visible)
- **When expanded:**
  - Each bid row: flex space-between, 12px vertical padding, 1px bottom border
    - Left: bidder alias "Bidder \*\*\*23" (grey 12px)
    - Right: "AED 47,500" bold 13px dark + "2m ago" grey 10px below
  - **Top row (highest bid):** 3px teal left border, teal-light background, micro-chip "Highest ↑" (teal pill 9px)
  - Max 5 rows shown; "View all X bids" teal text link at bottom if more

---

### Desktop Layout: Right Column (replaces existing right column)

- **Countdown Card** (full width of right column)
- **Escrow InfoBox** (updated copy: "Your winning bid is held securely in escrow until the RTA transfer is confirmed.")
- **"Place a Bid" primary button** (full-width)
- **"Watch Auction" secondary button** (full-width)
- **Bid History Accordion** (below buttons)

---

## NEW PAGE 2 — Place a Bid

**Route:** `/plates/[id]/auction/bid`
**Purpose:** Bid entry and confirmation. User enters their bid amount and submits.

---

### Mobile Layout (top to bottom)

**1. Page Header**

- Back arrow → to Plate Detail
- Title: "Place a Bid"

**2. Plate Summary Card** (white card, flex row)

- PlateViz `sm` on left (with shadow)
- Right column:
  - Plate code + number + emirate (e.g. "Dubai · H 3010")
  - "Current highest bid: AED 47,500" (grey 11px below plate info)

**3. Countdown Strip** (teal-light horizontal bar, no card border)

- Clock icon (teal 14px) + "Auction ends in 1d 14h 22m" (teal-dark 12px semi-bold)
- Full-width, rounded-xl, 10px padding

**4. Bid Input Card** (white card, rounded-xl)

Section heading: "Your Bid" (13px semi-bold dark)

- **Input row:**
  - Grey left pill inside input field: "AED" (14px semi-bold)
  - Right side: large number input — pre-filled with minimum next bid (e.g. 49,000)
  - Font: 22px bold, teal-dark when valid, red when below minimum
  - Right-aligned number inside field

- **Helper text (below input), 3 states:**
  - Empty: "Minimum bid: AED 49,000" (grey 12px)
  - Below minimum: "Bid must be at least AED 49,000" (ArrowUp icon + red 12px text)
  - Valid: "✓ Valid bid" (CheckCircle icon + green 12px text)

- **Increment hint caption** (grey 11px):
  "Min increment: AED 1,500 · Current bid: AED 47,500"

**5. Binding Bid Warning** (amber box — same amber style as existing pages)

- TriangleAlert icon (amber 14px) + "Bids are binding. Once confirmed, you are committed to complete the purchase if you win." (11px amber-dark)

**6. Primary CTA — "Confirm Bid — AED 49,000"**

- Full-width teal, Hammer icon on left
- Bid amount shown inline in button text (updates as user types)
- Disabled (faded teal-light, `cursor-not-allowed`) when input empty or below minimum
- Enabled: normal teal, hover effect

**7. "Cancel" ghost link**

- Grey text only, centred, below primary button
- Routes back to Plate Detail

---

### Desktop Layout

- All content constrained to `max-w-lg` (512px), centred `mx-auto`
- Same vertical structure, just narrower and centred

---

## NEW PAGE 3 — Watching / Post-Bid State

**Route:** `/plates/[id]/auction/watching`
**Purpose:** Post-bid monitoring screen. Shows either "You're leading" or "You've been outbid". Has two distinct visual states.

---

### State A — Highest Bidder (Leading)

**1. Page Header**

- Title: "Watching Auction"
- No back arrow (or back goes to Plate Detail)

**2. Status Banner Card** (rounded-2xl, teal-light background, teal border)

- Large teal circle icon: CheckCircle2 (white, 30px) — same as escrow confirmation
- "Your Bid is Leading!" (18px bold teal-dark)
- Subtitle: "You are currently the highest bidder" (12px teal)

**3. Plate + Your Bid Card** (white card)

- PlateViz `sm` on left
- Right:
  - Plate code + number + emirate
  - "Your bid" label (10px grey) + "AED 49,000" (14px bold teal-dark)

**4. Live Countdown Card** (white card)

- "AUCTION ENDS IN" label (11px grey uppercase)
- Large monospace countdown — same format as the detail page
- Normal state: teal border. Urgent state (< 1h): red border + red background tint + red digits

**5. Bid History Card** (white card, collapsed by default, same component as detail page)

- Shows 3 most recent bids
- Your bid row highlighted: amber left border, amber-light background, "Your bid" micro-chip

**6. Info Strip** (grey background, 10px, centred)

- MessageCircle icon (grey 12px) + "You'll be notified if you're outbid"

**7. "View Plate Details" ghost link** (teal text, centred, below info strip)

---

### State B — Outbid

All sections above transform. Swap these:

**Status Banner → Outbid:**

- Amber background `#FFFBEB`, amber border
- TriangleAlert icon (amber 28px)
- "You've Been Outbid!" (18px bold `#78450A`)
- Subtitle: "Someone placed a higher bid. Bid again to stay in the race." (12px amber-dark)

**Plate + Bid Card → shows both values:**

- "Your previous bid" (10px grey) + "AED 49,000" (strikethrough grey)
- "Current highest bid" (10px grey) + "AED 52,000" (14px bold red `#DC2626`)

**Countdown Card:** unchanged (still ticking)

**Bid History Card:** your bid row now shows amber "Outbid" chip instead of "Your bid"

**Replace info strip + ghost link with:**

**"Bid Again" primary CTA** (full-width teal, Hammer icon)

- Pre-fills bid page with min next bid (AED 53,500)
- Routes to `/plates/[id]/auction/bid`

**"Drop Out" ghost link** (grey text, centred)

- Tapping shows a confirmation dialog:
  - Title: "Drop out of this auction?"
  - Body: "You won't be able to re-enter. The plate will go to the next highest bidder."
  - Button 1: "Keep Watching" (teal, primary)
  - Button 2: "Confirm Drop Out" (red, secondary/destructive)

---

## NEW PAGE 4 — Auction Won

**Route:** `/plates/[id]/auction/won`
**Purpose:** Winner confirmation. Routes the winner into the existing checkout → escrow flow.

---

### Layout

Full-screen centred layout — **same structure as the existing Transfer Complete page** (`/plates/[id]/checkout/complete`).
Content `max-w-md` (448px), `mx-auto`. Page background: grey `#F4F6F7`. Entry: fade-up slide animation.

**1. Win Icon**

- 80×80px teal circle
- **Hammer icon** (white, 36px) — _not_ CheckCircle, to signal "auction specific"

**2. "You Won the Auction!"** heading

- 22px bold teal-dark

**3. Description** (13px grey, centred):
"You won plate **H 3010** with a bid of **AED 52,000**"

- Plate code and bid in teal

**4. PlateViz `md`** (centred, drop shadow — shows the won plate)

**5. Payment Deadline Card** (amber-bg `#FFFBEB`, 4px amber left accent border)

- Clock icon (amber 14px) + "Complete payment within 24 hours" (13px bold amber-dark)
- Body: "Failure to pay may result in the plate being offered to the next highest bidder." (11px amber-dark)
- Countdown sub-text: "23h 41m remaining" (12px bold amber-dark)

**6. Cost Summary Card** (white card — identical structure to existing checkout breakdown):

- Row: "Winning bid" — "AED 52,000"
- Row: "Escrow Fee — Upper-mid" — "AED 1,500" (grey)
- Divider line
- Row: "Total Payable" (15px semi-bold) — "AED 53,500" (17px bold teal)

**7. "Proceed to Payment — AED 53,500" primary button**

- Full-width teal, ArrowRight icon
- Routes to: `/plates/[id]/checkout` (existing page — **no changes, works as-is**)

**8. "Decline Win" ghost link** (grey text, centred, below button)

- Tapping shows a confirmation dialog:
  - Title: "Are you sure you want to decline?"
  - Body: "The plate will be offered to the next highest bidder. This cannot be undone."
  - Button 1: "Keep My Win" (teal)
  - Button 2: "Yes, Decline" (red, destructive)

---

## MODIFIED: SIDEBAR (Desktop)

Add "Auctions" nav item **between Search and Estimator**:

```
  [House]       Home
  [Search]      Search
  [Hammer]      Auctions      ← NEW
                              (right side: small "24 live" teal-light pill)
  [Calculator]  Estimator
  [UserCircle]  Profile
```

- Hammer icon (Lucide `Hammer`) used for Auctions throughout
- The "24 live" count pill is always visible in the sidebar (even when not on the Auctions page)
- Active state: teal-light background, teal Hammer icon, dark label text

---

## MODIFIED: BOTTOM NAV (Mobile)

Replace the "Account/Profile" tab (currently a placeholder) with "Auctions":

```
  [House]    [Search]    [+]    [Hammer]    [Calculator]
   Home       Search    Post    Auctions    Estimator
```

- Hammer icon, label "Auctions" (same size as other labels)
- Active: teal icon + teal label
- Inactive: grey icon + grey label
- **Red dot badge** (6px, absolute top-right of icon): shown when any auction is ending in < 1 hour

---

## NEW COMPONENT — CountdownTimer

**Used on:** Auction PlateCard, Auction detail, Bid page, Watching page, Won page

### Variants

**Pill variant** (PlateCard):

- Format: `Clock + "2d 14h"` inside a rounded pill
- Normal: grey pill background, grey text
- Urgent (< 1h): red pill background (`#FEF2F2`), red text and icon

**Inline variant** (in strips, summaries):

- Plain text: `"Ends in 1d 14h"` — grey
- Urgent: red text, no background

**Large display variant** (Detail page, Watching page):

```
  01  :  14  :  22  :  11
  d      h      m       s
```

- 4 blocks, colon separators (grey)
- Numbers: 22–24px bold monospace (`font-mono`)
- Unit labels: 9px grey below each number
- Normal: teal-dark numbers
- Urgent (< 1h): red numbers, card gets red border + red-tinted background

---

## NEW COMPONENT — BidHistory

**Used on:** Auction detail page (collapsed accordion), Watching page (collapsed accordion)

### Structure

White card section with collapsible content.

**Header:** "Bid History" label + count chip (teal pill) + ChevronDown/Up toggle

**Each bid row:**

- Flex, space-between, 12px vertical padding, 1px `#E5E8EA` bottom border
- Left: bidder alias "Bidder \*\*\*23" — grey 12px
- Right: amount "AED 47,500" bold 13px dark + timestamp "3m ago" grey 10px below

**Row variants:**

- **Highest bid row:** 3px teal left border, teal-light `#E5F9F8` background, micro-chip "Highest ↑" (teal pill 9px, bold)
- **Your bid row:** 3px amber left border, amber-light `#FFFBEB` background, micro-chip "Your bid" (amber pill 9px)
- **Outbid row:** Your bid row but chip says "Outbid" in red with red left border

**Footer:** "View all X bids" teal text link if count > 5

---

## FLOW SUMMARY TABLE

| Screen                    | Route                            | Status          | Entry from                             |
| ------------------------- | -------------------------------- | --------------- | -------------------------------------- |
| Home (modified)           | `/`                              | Modified        | —                                      |
| Auctions Browse           | `/auctions`                      | **New**         | Sidebar / BottomNav / Home "View all"  |
| Plate Detail (Auction UI) | `/plates/[id]`                   | Modified        | Any auction PlateCard                  |
| Place a Bid               | `/plates/[id]/auction/bid`       | **New**         | "Place a Bid" on detail page           |
| Watching — Leading        | `/plates/[id]/auction/watching`  | **New**         | After confirming bid                   |
| Watching — Outbid         | `/plates/[id]/auction/watching`  | **New (state)** | Push notification / page refresh       |
| Auction Won               | `/plates/[id]/auction/won`       | **New**         | Auction closes, user is highest bidder |
| Checkout (Payment)        | `/plates/[id]/checkout`          | **Unchanged**   | "Proceed to Payment" on Won page       |
| Escrow Status             | `/plates/[id]/checkout/escrow`   | **Unchanged**   | After payment                          |
| Transfer Complete         | `/plates/[id]/checkout/complete` | **Unchanged**   | After transfer confirmed               |

---

## DESIGN NOTES FOR STITCH

1. **Reuse existing components exactly.** PlateViz, PageHeader, InfoBox, Pill, Hero, IBox — all unchanged.
2. **Hammer icon** (Lucide `Hammer`) is the universal auction metaphor — used in nav, buttons, Won screen, and as the tab icon.
3. **Monospace countdown:** use `font-mono` or `tabular-nums` so digits don't shift as they tick.
4. **Card pattern is consistent:** all new pages follow the same white-card / grey-background / teal-accent pattern.
5. **The Plate Detail page has two modes** — design both: (A) existing fixed-price version and (B) this auction version, same route.
6. **Mobile-first:** design at 390px width first, then 1280px desktop.
7. **Outbid state** is the most emotionally charged screen — amber/warning colours are intentional to create urgency.
8. **Watching page is a single page with two states** (Leading vs Outbid) — not two separate pages.
9. **Existing checkout/escrow/complete pages need zero design changes** — the auction just routes into them.
