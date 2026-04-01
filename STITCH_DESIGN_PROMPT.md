# Sakk — Google Stitch Design Prompt

## Complete Page-by-Page Design Specification

---

## ABOUT THE PRODUCT

**Sakk** is a UAE number plate marketplace. Users can buy, sell, and gift UAE vehicle number plates with full e-escrow payment protection. The escrow system holds funds securely until the official RTA (Roads and Transport Authority) transfer is confirmed, protecting both buyer and seller.

**Target Users:** UAE residents who want to buy, sell, or gift personalised number plates (e.g. "Dubai A 786", "Abu Dhabi 7 88939").

**Platform:** Responsive web app. Mobile-first, with a desktop sidebar layout.

---

## DESIGN SYSTEM

### Brand Colors

| Token          | Hex       | Usage                                           |
| -------------- | --------- | ----------------------------------------------- |
| Teal (Primary) | `#0CBFB8` | CTAs, active states, accents, icons             |
| Teal Dark      | `#063D3A` | Hero backgrounds, headings, success states      |
| Teal Light     | `#E5F9F8` | Active pill backgrounds, info card fills        |
| Teal Border    | `#A7E8E5` | Borders on teal-light surfaces                  |
| Background     | `#F4F6F7` | Page background, input backgrounds              |
| Card White     | `#FFFFFF` | Card surfaces, header/nav backgrounds           |
| Border         | `#E5E8EA` | Card borders, dividers, input borders           |
| Text Primary   | `#111111` | Headlines, important values                     |
| Text Secondary | `#555555` | Body text, labels                               |
| Text Tertiary  | `#999999` | Captions, timestamps, placeholder hints         |
| Green          | `#16A34A` | "Below Market" badges, success, confirmed funds |
| Green BG       | `#F0FDF4` | Green badge background                          |
| Amber          | `#D97706` | Warnings, info notices                          |
| Amber BG       | `#FFFBEB` | Warning box fill                                |
| Red            | `#DC2626` | "Above Market" badge, validation errors         |

### Typography

- **Primary font:** Inter / system-ui / Arial sans-serif
- **Monospace font:** used for transaction refs (e.g. `SKK-2024-50124`)
- **Arabic font:** Noto Sans Arabic (for Arabic plate text on plate visualisations)

### Spacing & Radius

- Card border-radius: `12px` (rounded-xl)
- Larger cards/banners: `16px` (rounded-2xl)
- Buttons: `12px` (rounded-xl)
- Pill badges: `9999px` (fully rounded)
- Base padding: `16px` mobile, `24px–32px` desktop

### Elevation

- Cards: `1px solid #E5E8EA` border, no shadow
- Plate visualisations: `box-shadow: 0 4px 18px rgba(0,0,0,0.18)` — distinct lift
- Hover state on plate cards: `translateY(-3px) + box-shadow: 0 8px 24px rgba(0,0,0,0.1)`

### Plate Visualisation Component (`PlateViz`)

The plate is always rendered as a realistic physical plate SVG/HTML element. Three types:

1. **Dubai Gold plate:** Gold/yellow background (`#FFD700`), black serif text, Arabic "دبي" at top
2. **Abu Dhabi plate:** White background, red left-side band with code letter in white, Arabic "الإمارات أبوظبي" label, number centred
3. **Sharjah plate:** White background, green left-side band, Arabic "الشارقة" text, number in black

Sizes: `sm` (120×60px), `md` (168×84px), `lg` (252×126px)

### App Shell (Layout)

**Mobile (< 1024px):**

- Full-screen single-column layout
- **Bottom navigation bar** (fixed, white card surface, 1px top border):
  - 5 tabs: Home, Search, Post (+), Estimator (calculator icon), Profile
  - Active tab: teal icon + teal label text
  - Inactive tabs: grey icon + grey label text
  - "Post" centre tab: large teal pill button with `+` icon

**Desktop (≥ 1024px):**

- **Sidebar** (240px fixed left panel, full height, white background, right border):
  - Sakk Logo at top with tagline "UAE Plate Marketplace"
  - Navigation items (each with Lucide icon + label):
    - Home (House icon)
    - Search (Search icon)
    - Estimator (Calculator icon)
    - Profile (UserCircle icon)
  - Divider line
  - "Post a Plate" button (teal background, PlusCircle icon)
  - Footer: "100% Escrow Safe" badge in teal-light
  - Active item: teal-light background fill, teal icon + dark text
  - Hover state: subtle teal-light/50 background with 200ms ease transition
- **Main content area:** scrollable, fills remaining width

---

## PAGE 1 — Home / Marketplace

**Route:** `/`
**Purpose:** The main discovery hub where users browse available UAE number plates.

### Mobile Layout (top to bottom)

1. **Top Header Bar**
   - White card background, 1px bottom border
   - Left: Sakk logo (teal wordmark)
   - Right: Bell icon button (34×34px circle, grey background)

2. **Hero Banner**
   - Full-width teal-dark (`#063D3A`) background
   - Small teal pill badge: "UAE PLATE MARKETPLACE" (uppercase, 10px, letter-spacing 1.5px)
   - H1: "Safe Plate Transfers" (white, bold, large)
   - Accent line: "Secured by Sakk" (teal colour, same size as H1)
   - Subtitle: small grey-white body text
   - Compact height on mobile (~160px), slightly shorter on desktop

3. **Categories Row** (3-column grid, 16px padding)
   - 3 pill/card tabs: "Car Plates · 4,823", "Bike Plates · 891", "Boat Numbers · 234"
   - Active tab: teal-light background, teal border, teal text
   - Inactive tabs: white background, grey border, grey text
   - Each card: centred, 2 lines (category name + count), `12px` rounded

4. **Quick Actions Row** (3-column grid)
   - 3 action cards: "Deals" (Tag icon), "Quick Sale" (Zap icon), "Gift a Plate" (Gift icon)
   - Each: white card, 12px radius, teal-light square icon container (36×36px), label below icon
   - Hover: lift animation via plate-card CSS class

5. **Stats Row** (3-column grid)
   - 3 stat cards: "80K+" / Transfers/yr, "100%" / Escrow Safe, "GCC" / Ready
   - Each: white card, bold large number in teal-dark, tiny caption in grey

6. **Trending Plates Section**
   - Section header row: "Trending Plates" (bold, 15px) + "View all" teal link
   - Tab bar: "Car Plates" | "Bike Plates" | "Boat Numbers"
     - Active tab: teal text + 2px teal bottom border
     - Inactive: grey text, no border
   - **Plate Grid:** 2 columns on mobile, 4 columns on desktop, 5 on extra-wide
     - Each plate card (`PlateCard` component):
       - White card, 12px radius, hover lift
       - Plate visualisation (`PlateViz sm`) at top, centred
       - Emirate · Code · Number label
       - Price in bold teal-dark
       - "Verified" tag if applicable
       - "X days ago" in small grey

### Desktop Differences

- Top header: shows "Marketplace" H1 heading + subtitle instead of logo (logo is in sidebar)
- Content wrapped in `max-w-[1280px] mx-auto` with `px-8 py-6` padding
- Plate grid becomes 4-column (xl: 5-column)
- Hero is more compact vertically (~120-160px tall)

### Interactions

- Category tabs are tappable/clickable (filters plate grid)
- Quick action cards navigate to relevant pages
- "View all" button goes to Search page
- Tab switching in trending plates section animates smoothly
- Plate cards have hover lift + navigate to Plate Detail on click
- Staggered fade-up animation on page load (categories → quick actions → stats → grid)

---

## PAGE 2 — Search

**Route:** `/search`
**Purpose:** Filter and search the plate inventory by number, emirate, code letter, and digit count.

### Layout (Mobile — stacked)

1. **Search Controls Panel** (white card background, bottom border)
   - Section title: "Find a Plate" (16px, semi-bold) with "Reset" teal link on right
   - **Main search input** (full-width): placeholder "Search by number, birthday, lucky digits..."
     - Rounded, grey-bg input, teal border on focus
   - **Filter row** (3-column grid):
     - Emirate dropdown: Dubai, Abu Dhabi, Sharjah, Ajman, RAK
     - Code/Letter text input: placeholder "Code/Letter"
     - Digits dropdown: 1, 2, 3, 4, 5
   - **Advanced toggle** (teal text button + ChevronDown/ChevronUp icon):
     - Expands a helper tip box with grey background: "Smart search: try your birthday..."
   - **"Search Plates" primary button** (full-width, teal, white text)

   _On desktop:_ max-width `760px`, centred with `mx-auto`

2. **Results Area** (grey background, padding)

   **State A — Before search (Popular Searches):**
   - "Popular searches" label (13px, semi-bold)
   - Chip row (flex-wrap, gap-8px):
     - Each chip: white/grey-bg rounded button, "786" bold + "Lucky number" grey caption
     - Chips: 786 Lucky number, 1234 Sequential, 5555 Repeating, 1001 Mirror

   **State B — Results found:**
   - "X plates found" caption (grey, 12px)
   - **Plate grid:** 2 columns mobile / 3 columns desktop (same PlateCard component as Home)

   **State C — No results:**
   - Centred empty state: "No plates found" + "Try adjusting your filters" caption

### Desktop Differences

- Search controls and results both constrained to `max-w-[760px] mx-auto` — centred on wide screens
- Results grid: 3 columns

---

## PAGE 3 — Plate Detail

**Route:** `/plates/[id]`
**Purpose:** Full listing page for a single number plate. Shows price, market analysis, seller info, and two CTAs: Buy or Gift.

### Layout (Mobile — stacked)

1. **Page Header** (white bar, back arrow + "Plate Details" title)

2. **Plate Hero** (full-width teal-dark background)
   - PlateViz `lg` size, centred, with drop shadow (`plate-shadow`)
   - Below plate: pill badges for Emirate, digit count, "Verified" (if applicable)

3. **Content Area** (padding 16px)

   **Price Block:**
   - If originally higher: crossed-out original price in grey
   - Large price: bold, 26px, dark text (e.g. "AED 89,000")
   - Sub-caption: "+ AED X,XXX escrow fee · [tier] tier" in grey
   - If verified: teal badge on right ("✓ Verified", BadgeCheck icon)

   **Seller Card:**
   - White card, rounded-xl
   - UserCircle icon (38px, teal) + name + "Emirates · Listed X days ago"

   **Market Price Analysis Card:**
   - White card, rounded-xl
   - Header row: "Market Price Analysis" + valuation badge (e.g. "Below Market" in green pill, or "Above Market" in red, or "Fair Price" in teal)
   - Min/max price labels (small grey text, left and right)
   - **Price bar:** gradient bar with 3 zones:
     - Green zone (0%–40%): `#16A34A`
     - Amber zone (40%–70%): `#D97706`
     - Red zone (70%–100%): `#DC2626`
     - White divider ticks at 40% and 70% positions
     - Position thumb (14×14px circle, white border, coloured fill matching zone) at current price position
   - Caption: "Current asking price: AED XX,XXX" (teal value)

### Desktop Layout (2-column)

Left column: Price block, Seller card, Market Analysis card
Right column:

- Escrow InfoBox (teal shield icon, "Protected by Sakk Escrow" heading, description)
- **"Buy Now — Secured by Escrow"** primary CTA button (full-width, teal)
- **"Gift this Plate"** secondary CTA button (white background, teal border + teal text)

On mobile, the two CTA buttons appear below the market analysis card (stacked).

---

## PAGE 4 — Checkout (Buy)

**Route:** `/plates/[id]/checkout`
**Purpose:** Purchase confirmation and payment. Two-column on desktop.

### Layout

1. **Page Header** (back to Plate Detail)

2. **Two-column grid on desktop (lg:grid-cols-2)** / stacked on mobile:

**Left Column:**

**Plate Summary Card:**

- White card, flex row
- PlateViz `sm` on left
- Right: bold plate code/number/emirate, "Sold by [seller]", optional "✓ Verified seller" (BadgeCheck, teal)

**Payment Breakdown Card:**

- White card
- "Payment Breakdown" heading with bottom border
- Row: "Plate Price" — "AED XX,XXX"
- Row: "Escrow Fee — [tier]" (grey) — "AED X,XXX" (grey)
- Divider
- Row: "Total Payable" (15px semi-bold) — "AED XX,XXX" (17px bold, teal)

**Right Column:**

**Escrow InfoBox** (same as Plate Detail page)

**Payment Method Selection:**

- Section label: "Payment method" (12px grey)
- 3 selectable option cards (tappable):
  - **Bank Transfer** (Building2 icon) — "Recommended · Lowest fees"
  - **Credit / Debit Card** (CreditCard icon) — "Visa, Mastercard, Amex"
  - **Apple Pay** (Smartphone icon) — "Touch or Face ID"
- Each card: grey-bg rounded-xl, icon on left in icon box, label + subtitle text
- **Selected state:** teal-light background fill, teal border (1.5px), teal icon box, checkmark (✓) on right
- **Unselected state:** grey-bg background, grey border, grey icon box

**"Pay AED XX,XXX — Secure in Escrow"** primary button (full-width, teal, white text)

Small disclaimer text below button (centred, 11px grey): "By proceeding you agree to Sakk's escrow terms and transfer disclaimer"

---

## PAGE 5 — Escrow Status

**Route:** `/plates/[id]/checkout/escrow`
**Purpose:** Post-payment confirmation screen. Shows escrow is active and the transfer progress timeline.

### Layout

Content is max-width `672px` (max-w-2xl), centred with `mx-auto`.

1. **Top Logo Bar** (white bar, bottom border, Sakk logo)

2. **Confirmation Banner Card** (rounded-2xl, teal-light background, teal border)
   - Large teal circle with CheckCircle2 icon (white, 30px)
   - "Funds Secured in Escrow" (18px, bold, teal-dark)
   - Subtitle: "Payment protected. Seller notified to initiate the RTA transfer." (teal, 12px)

3. **Transaction Reference Card** (white card)
   - "Transaction Reference" caption (grey)
   - Monospace reference number (e.g. `SKK-2024-50124`) in bold dark text
   - Pill badges below: "AED XX,XXX held" · "Escrow Active" · "[tier] tier" (all teal-light pills)

4. **Transfer Progress Timeline Card** (white card)
   - Section title: "Transfer Progress"
   - **5-step vertical timeline:**

     Step visual states:
     - ✅ **Done** (steps 1–2): CheckCircle2 icon (teal), teal-border connector line below
     - 🔵 **Active** (step 3): Solid teal dot with `animate-ping` pulse ring, grey connector below
     - ⚪ **Pending** (steps 4–5): Empty circle (grey border), grey connector below

     Steps in order:
     1. "Payment Received" — "Funds secured in escrow" ✅
     2. "Seller Notified" — "Seller prompted to initiate RTA transfer" ✅
     3. "Transfer in Progress" — "Awaiting RTA authority confirmation" 🔵 (active)
     4. "Verification" — "Transfer confirmed by authority" ⚪
     5. "Ready to Collect" — "Visit any RTA registration centre" ⚪

   - Done/active step labels: dark text. Pending step labels: grey text.
   - Step sub-labels: all grey 11px text.

5. **Amber Warning Box** (amber-bg `#FFFBEB`, amber right border `1px solid #FCD34D`, **amber left accent border `4px solid #D97706`**)
   - Text: "Seller has 48 hours to initiate the RTA transfer. If they fail to act, you receive a full refund including the escrow fee." (11px, amber-dark text `#78450A`)

---

## PAGE 6 — Transfer Complete

**Route:** `/plates/[id]/checkout/complete`
**Purpose:** Success confirmation after the RTA transfer is officially confirmed.

### Layout

Full-screen centred layout (flexbox column, vertically centred).
Content constrained to `max-w-md` (448px).
Page background: grey (`#F4F6F7`).
Entry animation: fade-up slide.

1. **Success Icon** (80×80px teal circle, CheckCircle2 white icon 42px)

2. **"Transfer Confirmed!"** heading (22px, bold, teal-dark)

3. **Transfer description** (13px, centred grey text)
   - "Plate [CODE NUMBER] has been officially transferred to your name."
   - Plate code/number highlighted in teal

4. **Reference number** (monospace, 11px grey, e.g. `SKK-2024-50124`)

5. **"What's next?" Info Card** (teal-light background, teal-border)
   - Heading: "What's next?" (13px bold, teal-dark)
   - Body: "Visit any RTA registration centre with your Emirates ID to collect your plate. Bring your reference: [ref]"

6. **Summary Card** (white card)
   - Row: "Plate value paid" — "AED XX,XXX"
   - Row: "Funds released to seller" — "AED XX,XXX" (green text)

7. **"Back to Home"** primary button (full-width teal)

8. **"Download Receipt"** secondary button (white card, border)

---

## PAGE 7 — Gift Overview

**Route:** `/plates/[id]/gift`
**Purpose:** Landing page for gifting a plate. Shows the plate, seller, escrow info, and two CTA options: gift or buy for self.

### Layout

1. **Page Header** ("Gift a Plate", back to home)

2. **Plate Hero** (teal-dark background, PlateViz `lg` centred)

3. **Content Area** — max-width `760px`, centred on desktop

   **Price** (22px bold, dark text)

   **Plate Pill** (emirate · code number, teal-light pill)

   **Thin Divider Line**

   **Seller Card** (white card)
   - IBox avatar on left (circle icon, teal)
   - Seller name (13px medium)
   - "Emirate · Verified · Listed Xd ago" (grey caption)

   **Gift InfoBox** (★ star icon, "Gift this plate" heading)
   - Body: "Give this plate to someone special — wife, daughter, or a friend. They'll receive a personalised digital reveal and can accept at their convenience."

   **"Gift this Plate"** primary CTA button
   - Full-width on mobile
   - Max-width `480px`, centred on desktop

   **"Buy for Myself Instead"** secondary button (white card, border)
   - Full-width on mobile
   - Max-width `480px`, centred on desktop

---

## PAGE 8 — Gift Setup (Recipient Form)

**Route:** `/plates/[id]/gift/setup`
**Purpose:** Form to enter the gift recipient's details before proceeding to payment.

### Layout

Content max-width `600px`, centred on desktop.

1. **Page Header** ("Gift Details", back to Gift Overview)

2. **PlateViz `md`** (centred, preview of the plate being gifted)

3. **Form Card** (white rounded-2xl card, 16px horizontal padding)
   Three fields inside:

   **Field 1 — Recipient's Full Name** (required, marked with teal `*`)
   - Label: "Recipient's Full Name" (12px semi-bold grey)
   - Input: rounded, card-white background, border
   - Placeholder: "e.g. Fatima Al Rashid"

   **Field 2 — Personal Message** (optional)
   - Label: "Personal Message"
   - Textarea: 3 rows, `maxLength=140`, `resize: none`
   - **Character counter** in bottom-right corner of textarea: "X/140" (10px grey)
   - Placeholder: "e.g. Happy Birthday!"

   **Field 3 — Scheduled Delivery Date** (optional)
   - Label: "Scheduled Delivery Date (optional)"
   - Input placeholder: "e.g. 15 March 2025"

4. **"Continue to Payment →"** primary button
   - Full-width, teal when name is filled / faded teal-light when disabled
   - Disabled state: `cursor: not-allowed`, no hover effect
5. **Amber TCF Notice** (below button, amber-bg, amber right border, 4px left accent amber border)
   - Text: "The recipient will need to provide their TCF (Traffic Code File) number to complete the transfer. We'll guide them step by step."

---

## PAGE 9 — Gift Checkout (Payment)

**Route:** `/plates/[id]/gift/checkout`
**Purpose:** Payment confirmation for gifting. Shows recipient details, plate info, cost breakdown, and pay button. Two-column on desktop.

### Layout

Two-column on desktop (`lg:grid-cols-2`), stacked on mobile.

1. **Page Header** ("Gift Checkout", back to Gift Setup)

2. **Left Column:**

   **Recipient Card** (teal-light background, teal border)
   - Star IBox avatar
   - "Gifting to" label (teal, 11px)
   - Recipient name (14px semi-bold, teal-dark)
   - Message quote in italic if provided (optional, 11px teal-dark/80%)

   **Plate Summary Card** (white card)
   - PlateViz `sm` + plate info (emirate · code · number) + sold by [seller]

   **Payment Breakdown Card** (white card)
   - Same structure as Checkout page:
   - "Plate Price" — AED value
   - "Escrow Fee — [tier]" — AED value
   - Divider → "Total" — AED total (teal, 17px bold)

3. **Right Column:**

   **Escrow InfoBox** ("Protected by Sakk Escrow" — funds held until recipient accepts)

   **"Pay & Send Gift"** primary button (full-width teal)

   Small disclaimer text (11px grey centred): "Funds held in Sakk escrow until recipient accepts and transfer is confirmed"

---

## PAGE 10 — Plate Value Estimator

**Route:** `/estimator`
**Purpose:** Free tool to estimate the market value of any UAE plate.

### Layout

Two-column grid on desktop, stacked on mobile. A vertical divider separates the two columns on desktop.

**Hero Banner** (same component as Home, slightly shorter)

- Tag: "PLATE ESTIMATOR"
- H1: "What is your plate" H1 accent: "worth?"
- Subtitle: "Instant market estimate powered by real transaction data"

**Left Column — Input Form** (white/card background, generous padding)

Section heading: "Enter plate details" (14px semi-bold dark)

1. **Emirate** dropdown (label in grey uppercase tracking-wide)
   - Options: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah

2. **Plate Code / Letter** text input
   - Auto-uppercases input
   - Placeholder: "e.g. A, B, R, P, H"

3. **Plate Number** text input
   - Placeholder: "e.g. 5, 100, 786, 4242"

4. **"Estimate Value"** button (full-width teal, Sparkles icon, disabled until code + number filled)

5. **Live Plate Preview** (desktop only, appears below button when code or number entered):
   - "Live preview" grey label
   - PlateViz `lg` with drop shadow, centred
   - Animates in with scale-in effect

**Vertical Divider** (1px border, desktop only, between left and right column)

**Right Column — Results** (grey background `#F4F6F7`)

**Empty State** (before estimation):

- Large teal-light rounded-2xl icon box (BarChart2 icon, teal)
- "Your estimate will appear here" (14px medium grey)
- "Enter plate details and press Estimate Value" (12px light grey)
- Centred, vertically centred in right panel

**Results State** (after clicking Estimate Value):
Entry animation: fade-up

- **Mobile plate preview** (PlateViz `md` with shadow, hidden on desktop since left panel shows preview)
- "Estimated market value for [Emirate] [Code] [Number]" (grey caption, 11px)
- Main estimate: "AED 85,000" (28px, bold, teal-dark)
- High estimate: "High estimate: AED 110,000" (grey + dark)
- Thin divider line
- Pill tags: emirate, code letter, "45 recent sales" (teal-light hi-contrast pills)

**Market Metrics Card** (white card):

- "Market Metrics" heading (12px semi-bold)
- 3 metric bars:
  - **Demand:** 78/100 (teal bar progress)
  - **Rarity:** 62/100 (grey bar)
  - **Liquidity:** 85/100 (teal bar)
  - Each bar: label + score on top row, progress bar with animated fill below

**Comparable Sales Card** (white card):

- "Comparable sales" heading
- 3 rows of comparable plates: "R 11500 — AED 92,000 (+4%)" etc.
  - Change in green (positive) or grey (negative)

**"List Your Plate" CTA** (teal button, full-width, ArrowUpRight icon)

---

## PAGE 11 — Gift Reveal

**Route:** `/gift/reveal`
**Purpose:** The recipient's experience when they open their gifted plate. Emotional reveal + TCF entry to accept the transfer.

### Layout

1. **Dark Hero Reveal Section** (teal-dark `#063D3A` background, min 380px tall on desktop)
   Centred layout, flex column, vertically centred on desktop.
   - **"YOU RECEIVED A GIFT" badge** (pill, semi-transparent teal background + teal border, teal dot + uppercase 10px tracking text)
   - "From" label (13px, 70% white)
   - **Sender name** (18px bold white, e.g. "Mohammed Al Hamdan")
   - **PlateViz `lg`** (centred, with drop shadow over dark background)
   - **Personal message** (italic, 75% white, if present): `"Happy Birthday!"`

2. **Content Area** (max-width `xl` = 576px, centred, 16px padding)

   **Plate Value Card** (white card, horizontal layout)
   - Left: "Plate Value" caption + "AED XX,XXX" (20px bold teal-dark)
   - Right: Pill badge showing "Emirate · Code Number"

   **TCF Entry Card** (white card)
   - "Enter your TCF Number" heading (13px semi-bold dark)
   - Body instruction: "Your Traffic Code File number is required by the RTA to complete the ownership transfer. Find it on your Mulkiya or in the RTA app." (11px grey)
   - TCF input: border turns teal on focus and when valid (≥6 chars)
   - Validation states:
     - Typing but < 6 digits: red error message "TCF number should be at least 6 digits"
     - ≥ 6 digits: green success tick "✓ TCF format looks valid"

   **"Accept Gift & Start Transfer"** primary button
   - Full-width teal when TCF valid
   - Faded teal-light when disabled (TCF too short)

   **"Decline Gift"** button
   - **Mobile:** Bordered secondary button (white card + grey border + grey text)
   - **Desktop (lg:):** Ghost link style (no background, no border, teal text, font-medium)

---

## SHARED COMPONENTS REFERENCE

### PageHeader

- White card background, 1px bottom border
- Left: ArrowLeft icon button (tappable, navigates back)
- Centre: page title (15px semi-bold dark text)
- Spacer right (mirrors left button width for optical centering)

### PlateCard (listing card in grids)

- White card, rounded-xl, 1px border
- PlateViz `sm` at top, padded
- Emirate label (10px grey)
- Price (13px bold dark)
- Code + number (11px medium)
- "Verified" badge (teal text, 10px) if applicable
- "X days" tag (10px grey)
- Hover: lifts 3px + box-shadow

### InfoBox

- White card, rounded-xl, 1px border
- Top row: icon box (teal-light 40×40px square, teal icon) + title (13px semi-bold)
- Body text (12px grey, 1.5 line-height)

### Pill / Badge

- Fully rounded (border-radius: 9999px)
- **Normal:** grey-bg, grey text, grey border
- **Hi-contrast:** teal-light bg, teal text, teal border

### TLine (Thin horizontal divider)

- 1px solid sakk-border, 12px vertical margin

### IBox (Icon avatar)

- Specified size (default 40px) square, teal-light bg, teal border
- Symbol/icon centred, teal colour

---

## ANIMATIONS & TRANSITIONS

| Name           | CSS                                                | Trigger                        |
| -------------- | -------------------------------------------------- | ------------------------------ |
| `fadeUp`       | `opacity: 0 → 1, translateY(14px → 0)`, 350ms ease | Page load sections (staggered) |
| `fadeIn`       | `opacity: 0 → 1`, 350ms ease                       | Generic reveal                 |
| `scaleIn`      | `scale(0.94) → scale(1)`, 350ms ease               | Confirmation banners           |
| `slideInLeft`  | `translateX(-14px) → translateX(0)`, 350ms ease    | Sidebar items                  |
| `animate-ping` | Scale pulse ring, infinite                         | Active escrow timeline step    |

Stagger delays: 0ms → 60ms → 120ms → 180ms for sequential items.

---

## RESPONSIVE BREAKPOINTS

| Breakpoint | Width    | Layout                       |
| ---------- | -------- | ---------------------------- |
| Mobile     | < 1024px | Single column, bottom nav    |
| Desktop    | ≥ 1024px | 240px sidebar + main content |

Key desktop adaptations:

- Plate grids: 2-col → 4-col (5-col extra-wide)
- Checkout / Gift Checkout / Plate Detail: stacked → `grid-cols-2`
- Search / Gift Overview / Gift Setup: centred with max-width constraint
- Estimator: stacked → `grid-cols-2` with vertical divider
- Gift Reveal hero: taller with vertical centering
- Buttons in single-flow pages: `max-w-[480px] mx-auto` (not full viewport width)
- "Decline Gift": full button on mobile → ghost text link on desktop
