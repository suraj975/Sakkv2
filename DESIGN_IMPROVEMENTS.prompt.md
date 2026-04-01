# Sakk — Design Improvement Prompt

> Generated from live screenshots of http://localhost:3000/ (April 2026)
> Mobile viewport: 430×932 · Desktop viewport: 1280×900 (both captured).
> Brand: teal (#0CBFB8), teal-dark (#063D3A), sakk-bg (#F4F6F7), card white.

---

## Global Issues (apply across all pages)

| Issue                                                          | Fix                                                                                                   |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Content clips/overflows container horizontally                 | Add `overflow-x-hidden` on `<body>` and ensure all flex/grid rows use `min-w-0` on children           |
| No micro-interactions on interactive elements                  | All `<button>` and `<a>` elements need `transition-all duration-200 active:scale-95 cursor-pointer`   |
| Bottom navigation text labels barely visible at small sizes    | Increase BottomNav label font to `text-[11px]` and add `font-medium`                                  |
| Page header back-arrow is a plain Unicode ←                    | Replace with Lucide `ArrowLeft` icon (20px), add hover circle `hover:bg-sakk-bg rounded-full p-1`     |
| Avatar placeholder "N" in bottom-left from Next.js dev overlay | Not a design issue — hide/ignore in production                                                        |
| Mobile status-bar overlap                                      | The 16:22 time bleeds over content — add `pt-safe` / `env(safe-area-inset-top)` top padding           |
| All forms: missing focus ring                                  | Add `focus:ring-2 focus:ring-teal/40 focus:border-teal` to every `<input>` and `<select>`             |
| Primary teal buttons hover state missing                       | Add `hover:brightness-110 hover:shadow-md` to all solid teal buttons                                  |
| Secondary / outline buttons need hover fill                    | Add `hover:bg-teal-light` transition so they feel interactive                                         |
| Typography inconsistency: mixes `font-bold`/`font-semibold`    | Standardize: headings `font-bold`, labels `font-semibold`, body `font-normal`                         |
| **Desktop: buttons stretch to full content width (~1040px)**   | All CTA buttons need `lg:max-w-[480px] lg:mx-auto` or must live inside a max-width constrained parent |

---

## Page-by-Page Design Improvements

---

### 1. Home Page (`/`)

**Current state (screenshot observed):**

- Hero section has white text + teal subheading, good dark-teal background. But the text overflows the right edge (no `px` padding applied consistently).
- Category tabs (Car Plates / Bike Plates / Boat Numbers) with counts — layout truncates on narrow widths.
- Quick-action card row (Deals / Quick Sale / Gift a Plate) is 3-col but icons are tiny and labels are plain `text-xs`.
- Stats row (80K+ / 100% / GCC) shows raw numbers with no background separation.
- "Trending Plates" tab row has underline on active but "View" link is clipped off the right edge.
- Plate cards display in a 2-col grid (good for mobile) but card boundary is subtle — plates blend into background.

**Required improvements:**

#### 1a. Hero section

```
- Add px-5 py-6 to hero content so text never clips at screen edge
- Shrink hero max-height: `min-h-[200px]` instead of tall block — on mobile this wastes prime scroll real-estate
- Add a subtle radial gradient overlay: `bg-gradient-to-br from-teal-dark to-[#041f1e]`
- The badge pill ("● UAE PLATE MARKETPLACE") — increase letter spacing to `tracking-[0.15em]` and brighten dot to teal color
- Subheading "Secured by Sakk" needs `leading-tight` — currently drops to a 3rd line on narrow widths
- Add a very subtle animated background: slow CSS radial pulse or shimmer on the teal-dark surface
```

#### 1b. Category tabs (Car Plates / Bike Plates / Boat Numbers)

```
- Currently plain pill-style. Make active tab: solid teal bg + white text + subtle shadow
- Inactive tabs: border border-teal/30 + teal text
- Add horizontal scroll snap if tabs overflow: `overflow-x-auto flex snap-x snap-mandatory`
- Counts inside tabs: show as a small badge `rounded-full bg-white/20 text-[10px] px-1.5` inline
```

#### 1c. Quick-action cards (Deals / Quick Sale / Gift a Plate)

```
- Cards need visual depth: add `shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`
- Icon containers: use a colored circular bg — teal-light for Deals, amber-bg for Quick Sale, purple/pink-bg for Gift
- Labels: bump to `text-sm font-semibold text-sakk-text`
- Add a subtle right-arrow or chevron icon on the far right of each card to hint interactivity
```

#### 1d. Stats row (80K+ / 100% / GCC)

```
- Give the stats row a card surface: `bg-sakk-card border border-sakk-border rounded-xl shadow-sm`
- Each stat: vertical stack with large `text-2xl font-bold text-teal` value + `text-xs text-sakk-text3` label
- Dividers between stats: `border-r border-sakk-border` (skip last one)
- Animate numbers in on mount: use CSS counter animation (or requestAnimationFrame count-up)
```

#### 1e. Trending Plates section

```
- Section header: make "View" link have `text-teal font-semibold hover:underline` and ensure it never clips — use `justify-between` flex
- Tab bar (Car Plates / Bike Plates / Boat Numbers): use bottom-border indicator style:
  active = `border-b-2 border-teal text-teal font-semibold`
  inactive = `text-sakk-text3 hover:text-sakk-text`
- Plate cards: add card hover lift + teal left-border on hover
- "AED 27,500" in bold, strikethrough original price in `text-sakk-text3 line-through text-sm`
- Listing age badge: keep `2d` pill but add background `bg-sakk-bg text-sakk-text3 rounded-full px-2 py-0.5 text-xs`
```

#### 1f. Desktop layout (lg:)

```
- Hero: cap at max-h-[180px], make it span full content width
- Category + Quick-action rows: `max-w-[900px]` contained
- Stats row: horizontal flex with 3 items equally spaced
- Trending grid: switch to `grid-cols-3` (3 visible plates per row on desktop)
- Sidebar: ensure sidebar links have Lucide icons + text labels, not Unicode symbols
```

---

### 2. Search Page (`/search`)

**Current state:**

- "Find a Plate" header with what appears to be a "Reset" action clipped on right.
- Search text input is full-width but underused visually.
- Filter fields (Emirate / Code/Letter / Digits) are inline but cramped — no border or visual grouping.
- "▼ Advanced search options" is text-only toggle.
- "Search Plates" is the main CTA button — looks good but disabled state not differentiated.
- "Popular searches" section is a plain list with no icons or visual distinction.
- The second half of the page is entirely blank — very empty.
- No results shown (likely because nothing was searched in screenshot).

**Required improvements:**

#### 2a. Search bar

```
- Wrap the main text input in a card: `bg-sakk-card border border-sakk-border rounded-xl shadow-sm px-4 py-3`
- Add a Lucide `Search` icon on the left inside the input (absolute positioned)
- Input placeholder text: keep as is ("Search by number, birthday, lucky digits…")
- Add a clear (×) button on the right when there is content: Lucide `X` icon
- On focus: animate a teal border glow `focus-within:ring-2 focus-within:ring-teal/30`
```

#### 2b. Filter row

```
- Group all 3 dropdowns (Emirate, Code/Letter, Digits) in a single card `bg-sakk-card rounded-xl border border-sakk-border p-4`
- Each dropdown: full `border border-sakk-border rounded-lg px-3 py-2.5 text-sm` with label above
- "Advanced search options" toggle: replace ▼ with Lucide `ChevronDown`/`ChevronUp` that rotates 180° on open
- Advanced panel: slide down with `transition-all overflow-hidden` — not an abrupt show/hide
```

#### 2c. Search button

```
- Make disabled state: `opacity-40 cursor-not-allowed` (currently looks similar to active)
- Active state: solid teal + "Search Plates" with Lucide `Search` icon left
- Loading state: replace icon with Lucide `Loader2` spinning animation
```

#### 2d. Popular searches section

```
- Section heading "Popular searches" needs `text-sm font-semibold text-sakk-text2 uppercase tracking-wide mb-3`
- Each item: use a card chip style `inline-flex items-center gap-2 bg-sakk-card border border-sakk-border rounded-full px-4 py-2 text-sm cursor-pointer hover:border-teal hover:text-teal transition`
- Show them in a horizontal wrapping flex: `flex flex-wrap gap-2`
- Add Lucide `TrendingUp` small icon before each popular term
- Below, add a secondary heading "Browse by type" with chips for: Dubai plates, Lucky numbers, 2-digit, 3-digit, 4-digit
```

#### 2e. Empty / results states

```
- When no search: show illustrated empty state with a Lucide `Search` large icon (64px, teal/20 color) + "Enter a plate number or code above" subtext
- When results load: animate cards in with staggered fadeUp (nth-child delay 50ms each)
- Results header: "X plates found · Sorted by relevance" with a sort dropdown on right
- Results grid: `grid grid-cols-2 gap-3` on mobile, `grid-cols-3` on desktop
```

#### 2f. Desktop layout

```
- Split into 2 columns: left sticky filter panel 280px, right scrollable results
- Filter panel: stacked dropdowns + sliders for price range + emirate checkboxes
- Results area: 3-col grid with pagination at bottom
```

---

### 3. Plate Detail Page (`/plates/[id]`)

**Current state:**

- Dark teal hero banner holds plate visualization — looks great as a focal point.
- Plate chip badges (Dubai / 4 digits / Verified) are nicely styled.
- Price is bold and prominent but "Verified" badge on the right edge clips off.
- Seller card has avatar, name, city + listing age — clean.
- Market Price Analysis section has a progress bar — good visual but feels small.
- "Protected by Sakk Escrow" info box is clean with shield icon.
- Two CTAs at the bottom: "Buy Now — Secured by Escrow" (solid teal) + "Gift this Plate" (outline).

**Required improvements:**

#### 3a. Hero / Plate visualization banner

```
- Add a subtle inner glow/radial gradient from center: `radial-gradient(ellipse at center, #0a4a47 0%, #063D3A 100%)`
- PlateViz: add `filter: drop-shadow(0 6px 20px rgba(0,0,0,0.3))` and `hover:scale-[1.02] transition-transform duration-300`
- Badge chips below plate: add `gap-2 flex-wrap justify-center` and ensure they never clip
- Chip colors: "Verified" chip should be `bg-green-bg text-green border-green/30` to stand out from the neutral chips
```

#### 3b. Price + verified badge

```
- Ensure price row uses `flex items-start justify-between` — the Verified badge is clipping at right edge
- Add `px-4` or `px-5` padding to the section container
- Escrow fee + tier text: `text-xs text-sakk-text3` — currently fine, shrink slightly
- Verified badge: green pill with Lucide `BadgeCheck` icon + "Verified Listing"
```

#### 3c. Seller info card

```
- Seller avatar: replace simple circle with a colored ring based on verification status — `ring-2 ring-green/50` for verified
- "Verified" tag under seller name: add Lucide `CheckCircle2` icon (12px, green) inline
- Add a "View Profile" text link  (right-aligned, teal color)
- Listed timestamp: make relative ("2 days ago") and add a small clock Lucide icon
```

#### 3d. Market Price Analysis

```
- Label "Market Price Analysis" + "Below Market" pill — keep
- "Below Market" pill: `bg-green-bg text-green border border-green/20 rounded-full px-2.5 py-0.5 text-xs font-semibold`
- The range bar: increase height from ~4px to 6px, add rounded-full cap
- Add 3 markers on the bar: min (AED 60,520), current asking (AED 89,000), max (AED 131,720)
- Marker for current price: a small vertical tick + label above "You're paying"
- Color zone: first 40% of bar = green (good deal zone), 40–70% = amber, 70–100% = red
```

#### 3e. Escrow protection box

```
- Strengthen with a subtle left-border accent: `border-l-4 border-teal`
- Shield icon: increase to 24px, color it teal
- Add 3 micro-trust bullet points below the description:
  ✓ RTA-verified transfer process
  ✓ Funds only released after confirmation
  ✓ Full refund if transfer fails
- Each bullet: `flex items-center gap-2 text-xs text-sakk-text2` with Lucide `Check` (12px, teal)
```

#### 3f. CTA buttons

```
- "Buy Now — Secured by Escrow": add Lucide `ShieldCheck` icon left + subtle lock icon animation on hover
- "Gift this Plate": add Lucide `Gift` icon left
- Stack buttons with `gap-3 mt-4` — currently they feel too close
- Both buttons full-width, height 52px minimum (`min-h-[52px]`) for touch target compliance
```

---

### 4. Checkout Page (`/plates/[id]/checkout`)

**Current state:**

- Plate card at top (small thumbnail + "Dubai · H 3010" title + "Verified seller" badge) — right edge clips.
- Payment breakdown card is clean with line items and bold total.
- "Protected by Sakk Escrow" box with shield icon below the table — good.
- Payment method radio group (Bank Transfer / Credit/Debit Card / Apple Pay) uses plain HTML circles.
- Primary CTA "Pay AED 90,500 — Secure in Escrow".
- Legal disclaimer text below button is very small and partially clips.

**Required improvements:**

#### 4a. Plate summary card

```
- Fix right-edge clipping: ensure `mx-4` or `px-4` container padding is applied
- Thumbnail: add `rounded-lg border border-sakk-border shadow-sm` to the plate image
- "Verified seller" badge: `bg-green-bg text-green text-xs font-medium px-2 py-0.5 rounded-full` with Lucide `CheckCircle2`
- Add plate Emirates/code detail as a subtle `text-xs text-sakk-text3` subline
```

#### 4b. Payment breakdown

```
- Card: `bg-sakk-card border border-sakk-border rounded-xl shadow-sm p-4`
- Divider before "Total Payable": a `border-t-2 border-sakk-border` separator
- "Total Payable" row: make the left label `font-bold text-base` and value `font-bold text-teal text-xl`
- Escrow fee line: add a small Lucide `Info` (12px) tooltip icon after "Escrow Fee — Upper-mid"
```

#### 4c. Payment method selection

```
- Replace plain radio circles with styled selection cards:
  Each option = `flex items-center gap-3 px-4 py-3.5 rounded-xl border border-sakk-border cursor-pointer
                 transition-all hover:border-teal/40 has-[:checked]:border-teal has-[:checked]:bg-teal-light`
- Add payment logo icons:
  - Bank Transfer: Lucide `Building2` icon
  - Credit/Debit Card: Lucide `CreditCard` icon
  - Apple Pay: use Apple Pay SVG logo or Lucide `Smartphone`
- "Recommended" badge on Bank Transfer: `bg-teal text-white text-[10px] px-2 py-0.5 rounded-full ml-auto`
```

#### 4d. CTA + legal text

```
- Button: `min-h-[56px] text-base font-semibold` — increase touch target
- Add Lucide `Lock` (16px) icon before "Pay AED …" text
- Legal text: wrap in container, `text-[11px] text-center text-sakk-text3 leading-relaxed px-4`
- Make "escrow terms" and "transfer disclaimer" into tappable teal links
```

---

### 5. Escrow Status Page (`/plates/[id]/checkout/escrow`)

**Current state:**

- Teal/mint card container at top with circular checkmark icon (large, teal). Heading "Funds Secured in Escrow".
- Transaction reference + status chips (Escrow Active / Upper-mid tier) — clean.
- "Transfer Progress" timeline: 5 steps listed but all appear as faded dots/text — no visual distinction between completed and pending.
- The first two steps (Payment Received, Seller Notified) appear slightly darker but not clearly differentiated.
- Amber info box at bottom about the 48-hour seller window.
- A dev "Simulate Transfer Confirmed" button is visible — should be hidden in production.

**Required improvements:**

#### 5a. Header status card

```
- Keep the full-width teal-bg card
- Checkmark icon: use Lucide `CheckCircle2` (64px), animate it with a `scaleIn` keyframe on mount
- Add a pulsing ring around it: `animate-ping absolute inline-flex h-full w-full rounded-full bg-teal/30`
- Sub-description text: increase contrast to `text-teal-dark font-medium` (not just gray)
- Transaction ref: `font-mono text-sm` — add a Lucide `Copy` button next to it
```

#### 5b. Transfer Progress timeline

```
- CRITICAL: The progress timeline must clearly show done vs. pending states.
- Completed step:  `● teal filled circle (Lucide CheckCircle2)` + `text-sakk-text font-medium` label + `text-sakk-text3 text-xs` subtitle
- Active step:     `◉ teal ring border-2 border-teal with white center` + `text-teal font-semibold` label + animated pulse
- Pending step:    `○ empty circle border-2 border-sakk-border` + `text-sakk-text3` label (dim)
- Connecting line between steps: `w-0.5 h-8 bg-sakk-border ml-[9px]` — with teal color for completed segments
- Step container: `flex items-start gap-3 py-2`
```

#### 5c. Status chips

```
- "Escrow Active": `bg-teal-light text-teal border border-teal-bd rounded-full px-3 py-1 text-xs font-semibold`
- "AED 89,000 held": `bg-amber-bg text-amber border border-amber/30 rounded-full px-3 py-1 text-xs font-semibold`
- "Upper-mid tier": neutral pill
```

#### 5d. Amber info box

```
- Give it `border-l-4 border-amber` left accent
- Add Lucide `Clock` (16px, amber) icon before the text
- Make "full refund" bold: `font-semibold`
- Add a countdown timer: "47h 23m remaining" with a real-time decrement
```

#### 5e. Remove dev button

```
- "Simulate Transfer Confirmed" button must be wrapped in: `{process.env.NODE_ENV === 'development' && ...}`
- Or add a `?dev=1` query param gate so it never shows in production
```

---

### 6. Transfer Complete Page (`/plates/[id]/checkout/complete`)

**Current state:**

- Clean success state — large teal circle with checkmark, "Transfer Confirmed!" heading.
- "Plate H 3010 has been officially transferred to your name."
- Transaction number (SKK-2024-50124) in small mono font.
- "What's next?" info box with instructions to visit RTA registration centre.
- Financial summary (Plate value paid / Funds released to seller) — values clip on right edge.
- Two CTAs: "Back to Home" (solid teal) + "Download Receipt" (outline).

**Required improvements:**

#### 6a. Hero success section

```
- Add a brief confetti/sparkle animation on mount (CSS only — 6-8 star/dot particles expanding outward)
- The checkmark circle: add a success pulse animation for 2-3 cycles then stop
- Heading "Transfer Confirmed!": `text-2xl font-bold text-sakk-text` — maybe add slight color: `text-teal-dark`
- The plate reference "Plate H 3010": make the plate number a teal badge `bg-teal-light text-teal font-mono px-2 rounded`
- Transaction ref: `font-mono text-xs` center-aligned with a Lucide `Copy` icon
```

#### 6b. "What's next?" box

```
- Increase visual weight: `bg-teal-light border border-teal-bd rounded-xl p-4`
- Header: add Lucide `MapPin` icon before "What's next?"
- The "SKK-2024-50124" reference inside the box: monospace, teal, add copy icon
- Add a "Find nearest RTA centre" teal text link below (links to rta.ae)
```

#### 6c. Financial summary

```
- Fix right-edge clipping: ensure `px-4` or `mx-4` container padding
- "Plate value paid" row: add Lucide `Banknote` icon (14px, sakk-text3)
- "Funds released to seller": add Lucide `ArrowRight` icon (14px, green)
- Values: `font-semibold` + right-align with `tabular-nums`
```

#### 6d. CTAs

```
- "Back to Home": solid teal, `min-h-[52px]`, add Lucide `Home` icon left
- "Download Receipt": outline, add Lucide `Download` icon left, hover fills with teal-light
- Add a third option: "Share this Achievement" — a subtle ghost link with Lucide `Share2`
```

---

### 7. Gift — Plate Overview (`/plates/[id]/gift`)

**Current state:**

- Similar flow to plate detail but simplified for the gifter.
- Dark teal hero at top with plate visualization — identical to detail page.
- Price + "Dubai · H 3010" listing info below.
- Seller card (avatar, name, verified, listed date).
- "Gift this plate" feature card with star icon + description text.
- Two CTAs: "Gift this Plate" (solid teal) + "Buy for Myself Instead" (outline).

**Required improvements:**

#### 7a. Visual differentiation from plate detail

```
- Change the hero banner gradient to a gift-themed variant: add a subtle warm gold overlay tint
  `bg-gradient-to-br from-[#063D3A] to-[#0a3330]` with a faint gift icon watermark in the background
- Add a "GIFTING MODE" badge pill in the top-right of the hero (styled like the Verified chip but in amber/gold)
```

#### 7b. "Gift this plate" feature card

```
- Make it more prominent: full-width card with `border border-teal-bd bg-teal-light rounded-xl p-4`
- Star icon: replace with Lucide `Gift` (24px, teal color) in a teal-light circular bg
- Title: `text-base font-semibold text-teal-dark`
- Description text: `text-sm text-sakk-text2 leading-relaxed`
- Add 3 micro-benefits below:
  ✓ Digital reveal experience for recipient
  ✓ Funds held until recipient accepts
  ✓ Full refund if declined
```

#### 7c. CTAs

```
- "Gift this Plate": add Lucide `Gift` icon + animate a subtle gift-box bounce on hover
- "Buy for Myself Instead": dimmer style — `text-sakk-text2 border-sakk-border` — it's the secondary action
```

---

### 8. Gift Setup Form (`/plates/[id]/gift/setup`)

**Current state:**

- Small plate thumbnail at top (correct — less prominent than in detail view).
- Form fields: "Recipient's Full Name\*", "Personal Message", "Scheduled Delivery Date (optional)".
- Amber info box about TCF number requirement.
- "Continue to Payment →" is disabled/faded (no inputs filled).

**Required improvements:**

#### 8a. Header / plate context

```
- Add a "Gifting: H 3010 — AED 89,000" context strip above the form
  Style: `bg-teal-light border-b border-teal-bd px-4 py-2.5 text-sm font-medium text-teal-dark`
- Plate thumbnail: center it, add `drop-shadow` for depth
```

#### 8b. Form fields

```
- Wrap all fields in a white card: `bg-sakk-card border border-sakk-border rounded-xl p-5 space-y-5 shadow-sm`
- Each field:
  - Label: `text-sm font-semibold text-sakk-text mb-1.5 block`
  - Input: `w-full border border-sakk-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal/30 focus:border-teal transition`
  - Required asterisk: `text-red-500`
- "Personal Message" textarea: `min-h-[100px] resize-none`
- "Scheduled Delivery Date": consider using a native date picker (`<input type="date">`) styled with the input class
- Add character counter below Message: "0 / 200 characters" in `text-xs text-sakk-text3`
```

#### 8c. Amber TCF info box

```
- Move below the form (not between form and button) — it's context, not blocking
- Style: `border-l-4 border-amber bg-amber-bg rounded-r-xl p-4`
- Add Lucide `Info` (16px, amber) icon before text
- Make "Traffic Code File" a teal underline link to an explanatory page
```

#### 8d. Continue button

```
- Disabled state: `opacity-40 cursor-not-allowed` — must be visually distinct
- Enabled state: solid teal + `hover:brightness-110 active:scale-95`
- Change arrow "→" to Lucide `ArrowRight` icon
- Button label: "Continue to Payment" — remove → and use icon instead
```

---

### 9. Gift Checkout (`/plates/[id]/gift/checkout`)

**Current state:**

- "Gift Checkout" header.
- "Gifting to" section at top (star icon + "Gifting to" text) — but recipient's name is blank/empty.
- Plate summary card (thumbnail + "Dubai · H 3010" + "Sold by Ahmed Al Rashid").
- Payment breakdown (same as regular checkout).
- "Protected by Sakk Escrow" info box — shorter text variant.
- "Pay & Send Gift" CTA.
- Footer text about funds being held — clips off right edge.

**Required improvements:**

#### 9a. Gifting recipient context

```
- CRITICAL: "Gifting to" section must show the recipient name from the previous step
  Display: `bg-teal-light border border-teal-bd rounded-xl px-4 py-3`
  Content: `Lucide Gift icon (teal) · Gifting to: [Recipient Name] · [Delivery date if set]`
- If name is somehow empty: show a warning to go back and fill in the gift details
```

#### 9b. Plate + payment layout

```
- Same improvements as regular checkout (4 above)
- Payment breakdown label: change "Total" to "Total (Gift)" to differentiate contextually
```

#### 9c. Escrow info box

```
- Different copy from the regular checkout box — "Recipient must accept the gift before funds are released"
- Add step numbers: 1. You pay → 2. Gift is sent → 3. Recipient accepts → 4. Transfer completes
  Use small `text-xs` numbered steps in a horizontal flex inside the box
```

#### 9d. CTA

```
- "Pay & Send Gift": add Lucide `Send` icon left
- Below CTA: add a "Cancel and go back" ghost link — `text-sm text-sakk-text3 underline text-center`
```

---

### 10. Estimator Page (`/estimator`)

**Current state:**

- Dark teal hero banner: "PLATE ESTIMATOR" badge + "What is your plate worth?" heading — well designed.
- Form section: EMIRATE (Dubai) / PLATE CODE / PLATE NUMBER fields with `all-caps` labels.
- "Estimate Value" button is faded/disabled (awaiting input).
- Empty state: bar chart Lucide icon + "Your estimate will appear here" — decent placeholder.

**Required improvements:**

#### 10a. Hero section

```
- The hero is excellent — most polished section on this page
- Small improvement: add the animated sparkle/gradient shimmer to this hero as well (same as estimator tool = data/insight feel)
- Badge pill: "● PLATE ESTIMATOR" — keep styling, maybe add a Lucide `BarChart2` icon to the left of text
```

#### 10b. Form section

```
- Add a subtle card wrap: `bg-sakk-card border border-sakk-border rounded-2xl shadow-sm p-5 mx-4`
- Label style: currently ALL CAPS which is fine — add `tracking-wide text-[11px] font-semibold text-sakk-text2`
- Emirate select: show the UAE flag emoji 🇦🇪 inline as a leading visual
- Code/Letter input: add a hint tag or dropdown chip list of popular codes (H, P, R, W, etc.) shown as scrollable suggestions below the field
- Number input: add `inputmode="numeric" pattern="[0-9]*"` for mobile number pad
- "Estimate Value" button:
  - Disabled: `opacity-40 cursor-not-allowed`
  - Enabled: solid teal, `text-base font-semibold`
  - Loading: spinning Lucide `Loader2` replaces `BarChart2` icon
  - Add keyboard shortcut hint: `↵ Enter` badge on the right side (desktop only)
```

#### 10c. Results area (empty state)

```
- Current empty state is good — just needs more visual polish
- Bar chart icon: increase to 64px, color `text-sakk-border` (not default gray)
- "Your estimate will appear here": `text-base font-medium text-sakk-text2`
- Sub-text: `text-sm text-sakk-text3`
- Add 3 example chips below the empty state text:
  "Try: H 786" | "Try: P 1" | "Try: R 5555" — styled as teal ghost chips that auto-fill the form on click
```

#### 10d. Results area (after estimate)

```
- Result card: `bg-sakk-card border border-teal-bd rounded-2xl shadow-md p-5 animate-fade-up`
- Large estimated value: `text-4xl font-bold text-sakk-text`
- Confidence range: `AED X,XXX – AED Y,YYY` in `text-sm text-sakk-text3`
- Price gauge / bar visualization: same market range bar design as plate detail page
- "Sell on Sakk" CTA: teal button below the estimate
- "Compare 5 similar plates" ghost link below CTA
- Recent transactions section: last 3 sales of similar plates (compact list)
```

#### 10e. Desktop layout

```
- `lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start`
- Left col: hero (full width) + form below
- Right col: results area (sticky to top, `lg:sticky lg:top-8`)
- This eliminates the huge blank right-side space currently present on desktop
```

---

### 11. Gift Reveal Page (`/gift/reveal`)

**Current state — most polished page in the app:**

- "YOU RECEIVED A GIFT" badge + "From Ahmed" — great emotional intro.
- Plate visualization centered on dark teal background — excellent.
- Personal message in italic quotes — very nice touch.
- Plate value card + "Dubai · H 3010" chip — clear.
- "Enter your TCF Number" form section — good explanation text.
- Two CTAs: "Accept Gift & Start Transfer" (disabled, faded) + "Decline Gift" (outline).

**Required improvements (mostly polish as this page is closest to complete):**

#### 11a. Opening animation

```
- Add a gift-unwrapping reveal animation on page load:
  1. Gift box icon fades in and "opens" with CSS scale + rotate
  2. After 800ms: fade in the "YOU RECEIVED A GIFT" badge
  3. After 1200ms: slide in the plate visualization from below
  4. After 1600ms: fade in the message + value card
- Use CSS keyframes only, no library required
```

#### 11b. Header area

```
- "YOU RECEIVED A GIFT" badge: add a confetti burst behind it (CSS pseudo-elements or SVG)
- "From Ahmed" — the sender name should be `text-2xl font-bold text-white` not just medium text
- Add a subtitle: "They chose this plate especially for you"
- The dark teal background: add very subtle bokeh/light flare effect in top corners
```

#### 11c. Personal message

```
- Currently: italic "Happy Birthday" in quotes — nice but too small
- Increase to `text-lg italic text-white/90 leading-relaxed`
- Add open/close quotation SVG art marks (large 40px decorative quotemarks in teal/50 color)
- Add a gentle fade-in-up animation on the message text
```

#### 11d. Value card

```
- The `AED 89,000` value: make it `text-3xl font-bold`
- "Dubai · H 3010" chip: styled as a `rounded-full bg-sakk-bg border border-sakk-border px-3 py-1 text-xs` pill
- Add a "Market value" label above: `text-xs text-sakk-text3 uppercase tracking-wide`
```

#### 11e. TCF input section

```
- Card: `bg-sakk-card border border-sakk-border rounded-2xl shadow-sm p-5 mx-4`
- The explanation text is good ("Your Traffic Code File number is required…")
- Input field: `text-center text-xl font-mono tracking-[0.2em]` — for a PIN-code-like feel
- Add a "Find my TCF" tooltip/link in teal below the input
- Show a success state: when TCF looks valid (7 digits), show a green check icon on the input right side
```

#### 11f. CTAs

```
- "Accept Gift & Start Transfer": add Lucide `CheckCircle2` icon left, strong teal
- "Decline Gift": change from outline to `text-sm text-sakk-text3 underline` ghost link — visually demote it to reduce chance of accidental decline
- Add a "Questions?" small link at the very bottom
```

---

## Component-Level Improvements

### PlateCard component

```
- Add hover lift effect: `hover:-translate-y-1 hover:shadow-lg transition-all duration-200`
- Active border: `hover:border-teal/40`
- Price: `font-bold text-base` (currently may be regular weight)
- Strikethrough original price: `line-through text-sakk-text3 text-sm mr-2`
- Location + listing age: `flex items-center gap-1.5 text-xs text-sakk-text3`
- Add a "Quick View" overlay on hover (desktop): semi-transparent dark overlay with "View Details" button
```

### PlateViz component

```
- Add a drop shadow: `filter: drop-shadow(0 4px 16px rgba(0,0,0,0.18))`
- Ensure the plate border color matches type: gold for Dubai/standard, silver for bike, etc.
- The inner number text: keep `font-mono` but ensure sizes scale properly at all viewport widths
```

### BottomNav component

```
- Replace Unicode icons (⌂ ◎ ⊕ ○) with Lucide equivalents:
  Home → `<Home size={22} />`
  Search → `<Search size={22} />`
  Center "+" → `<PlusCircle size={28} />` with teal circle background
  Estimate → `<Calculator size={22} />`
  Account → `<User size={22} />`
- Active item: icon + label both `text-teal`, inactive: `text-sakk-text3 hover:text-sakk-text`
- Center "+" button: prominent teal circle `w-12 h-12 bg-teal rounded-full flex items-center justify-center shadow-lg`
```

### Sidebar (desktop)

```
- Replace Unicode symbols with Lucide icons (same set as BottomNav above)
- Nav item height: `min-h-[44px]` for accessibility
- Hover: `hover:bg-teal-light/50 rounded-lg transition-colors duration-150`
- Active: `bg-teal-light rounded-lg text-teal-dark font-semibold`
- "Post a Plate" button: solid teal, `rounded-xl py-2.5 mt-4 w-[calc(100%-32px)] mx-4`
- "100% Escrow Safe" footer badge: `border border-teal-bd bg-teal-light text-xs rounded-full`
```

### PageHeader component

```
- Back arrow: replace `←` text with Lucide `ArrowLeft` (20px) in a tap target circle `p-2 rounded-full hover:bg-sakk-bg`
- Title: `text-base font-semibold` (not too large — it's a navigation label, not a page heading)
- Right action slot: ensure content never clips — use `min-w-[44px]` for alignment symmetry
```

### InfoBox / IBox components

```
- The shield/info icon: use Lucide `ShieldCheck` or `Info` — not just a colored square
- Left accent border: `border-l-4 border-teal` for trust boxes, `border-l-4 border-amber` for warning boxes
- Background: `bg-teal-light` for trust (not just white bordered box)
```

---

## Animation System (globals.css additions)

Add these keyframes and utility classes:

```css
/* ── Additional keyframes ── */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes confetti {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx), var(--dy)) rotate(720deg);
  }
}

/* ── Animation utilities ── */
.animate-fade-up {
  animation: fadeUp 0.35s ease both;
}
.animate-fade-in {
  animation: fadeIn 0.25s ease both;
}
.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
.animate-slide-down {
  animation: slideDown 0.2s ease both;
}

/* ── Staggered card children ── */
.stagger-children > *:nth-child(1) {
  animation-delay: 0ms;
}
.stagger-children > *:nth-child(2) {
  animation-delay: 60ms;
}
.stagger-children > *:nth-child(3) {
  animation-delay: 120ms;
}
.stagger-children > *:nth-child(4) {
  animation-delay: 180ms;
}
.stagger-children > *:nth-child(5) {
  animation-delay: 240ms;
}
.stagger-children > *:nth-child(6) {
  animation-delay: 300ms;
}

/* ── Hover utilities ── */
.card-hover {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
}

/* ── Button press ── */
.btn-press:active {
  transform: scale(0.97);
}
```

---

## Priority Implementation Order

| Priority | Item                                                            | Pages Affected          |
| -------- | --------------------------------------------------------------- | ----------------------- |
| 🔴 P0    | Install `lucide-react`, replace all Unicode icons               | All pages               |
| 🔴 P0    | Fix horizontal overflow clipping (px padding on all containers) | All pages               |
| 🔴 P0    | Payment method radio → styled selection cards                   | Checkout, Gift Checkout |
| 🔴 P0    | Escrow timeline step differentiation (done/active/pending)      | Escrow status           |
| 🟠 P1    | Stats row → card with animated count-up                         | Home                    |
| 🟠 P1    | Search: empty state + popular searches as chips                 | Search                  |
| 🟠 P1    | Market price analysis bar zones + markers                       | Plate Detail            |
| 🟠 P1    | Gift reveal opening animation                                   | Gift Reveal             |
| 🟠 P1    | Estimator desktop 2-col layout                                  | Estimator               |
| 🟡 P2    | PlateCard hover lift + quick-view overlay                       | All listing pages       |
| 🟡 P2    | Add `animate-fade-up` stagger to all cards on route load        | All listing pages       |
| 🟡 P2    | Gift setup form card wrap + character counter                   | Gift Setup              |
| 🟡 P2    | Complete page confetti animation                                | Transfer Complete       |
| 🟢 P3    | Gift reveal gift-unwrap animation sequence                      | Gift Reveal             |
| 🟢 P3    | Sidebar / BottomNav hover + active state polish                 | Layout                  |
| 🟢 P3    | PageHeader back-button hover circle                             | Layout                  |
| 🟢 P3    | "Gifting to" recipient context in gift checkout                 | Gift Checkout           |

---

## Design Tokens Reference

```
Primary accent:     #0CBFB8  (teal)
Dark surface:       #063D3A  (teal-dark) — used in hero banners
Light tint:         #E5F9F8  (teal-light) — cards, selected states
Border accent:      #A7E8E5  (teal-border)
App background:     #F4F6F7  (sakk-bg)
Card background:    #FFFFFF  (sakk-card)
Card border:        #E5E8EA  (sakk-border)
Primary text:       #111111  (sakk-text)
Secondary text:     #555555  (sakk-text2)
Muted text:         #999999  (sakk-text3)
Success:            #16A34A  (green)
Success bg:         #F0FDF4  (green-bg)
Warning:            #D97706  (amber)
Warning bg:         #FFFBEB  (amber-bg)
```

---

## Desktop-Specific Observations (1280×900 screenshots)

> Screenshots taken at 1280×900 with the sidebar visible (240px left column).
> Content area = ~1040px wide. All issues below are **in addition to** the mobile issues above.

---

### Sidebar (visible on all desktop pages)

**Observed:**

- Sidebar shows "sakk + Arabic wordmark" logo at top — clean.
- "Post a Plate" button is solid teal pill with a `⊕` Unicode icon — does the job but Unicode icon looks amateurish at larger sizes.
- Nav items: only "Home" is visible with a `⌂` Unicode house icon + label. Other items (Search, Estimator) also use Unicode symbols.
- Active item (e.g. "Search" on search page) shows a `×` or indicator but the style is very subtle.
- "100% Escrow Safe" badge at the bottom of the sidebar — good trust signal, but the shield icon is very small.

**Required fixes:**

```
- Replace ⊕ in "Post a Plate" with Lucide `PlusCircle` (16px) — button needs icon + text, not Unicode
- All nav items: install lucide-react and use: Home → `<Home>`, Search → `<Search>`, Estimator → `<Calculator>`
- Active nav item: `bg-teal-light rounded-lg` background + `text-teal font-semibold` icon + label
- Inactive nav item hover: `hover:bg-sakk-bg rounded-lg transition-colors duration-150`
- Nav item min-height: `min-h-[44px]` for accessibility
- "100% Escrow Safe" badge: give it `border border-teal-bd bg-teal-light/50 rounded-xl px-3 py-2` for more presence
- Sidebar is only ~240px — consider adding a subtle `border-r border-sakk-border` separator from the main content
```

---

### 1. Home — Desktop (1280px)

**Observed from screenshot:**

- Hero spans full content width (1040px) — text is readable but the hero height is excessive at desktop, taking up ~35% of the viewport before any content.
- Below the hero: only "Car Plates" category tab is visible; "Bike Plates" and "Boat Numbers" tabs are present but the entire row takes up disproportionate width with no content.
- The quick-action cards (Deals / Quick Sale / Gift a Plate) and stats row are **completely invisible** — they appear to not render or are cut off in the screenshot, leaving a large blank zone between the category tabs and "Trending Plates".
- "Trending Plates" section starts around 65% down the page with only 1 plate card visible (very narrow column — cards are not using the full 1040px width).
- The plate card grid is still single-column on desktop — not utilizing the available width at all.
- "View all" link is visible and not clipped (desktop flex handles this correctly).

**Required desktop fixes:**

```
CRITICAL — Home page desktop layout is broken:
- The content area after the hero (categories + quick actions + stats) renders with full width but
  all items are either hidden or using mobile-width constraints. The entire middle section is blank.
- Apply `max-w-[1100px] mx-auto px-6` wrapper to all content sections below the hero.
- Category tabs row: `flex gap-3` with max-width tabs (not stretch to full column width)
- Quick-action cards: `grid grid-cols-3 gap-4` — currently missing/invisible at desktop
- Stats row: `grid grid-cols-3 gap-6` inside a card with `max-w-[700px] mx-auto`
- Trending grid: `grid-cols-3 xl:grid-cols-4` so multiple plate cards show per row
- Hero: reduce height — `min-h-[220px] max-h-[260px]` and vertically center the content
```

---

### 2. Search — Desktop (1280px)

**Observed from screenshot:**

- The search form spans the full 1040px width — the search input, 3 filter dropdowns, and "Search Plates" button are all full-width.
- This makes the search input extremely wide (unnecessarily) — a search box that spans 1040px looks odd and is ergonomically poor.
- The 3 filter dropdowns (Emirate / Code/Letter / Digits) are each ~340px wide — way too wide for simple dropdowns.
- "Popular searches" section has arrow `→` icons on the right of each item — these are visible at desktop.
- Bottom ~50% of the page is completely empty grey — confirmed wasted space.
- Sidebar shows "Search" nav item with an active state indicator.

**Required desktop fixes:**

```
- CRITICAL: Do not stretch the search form to full width at desktop.
  Wrap the main search input + filters in `max-w-[760px]` centered container.
- OR use the 2-col layout: left 300px sticky filter panel + right results area (as specified in 2f).
  Left panel: contains Emirate, Code/Letter, Digits, Advanced options stacked vertically.
  Right area: search input at top + results grid below.
- The "Search Plates" CTA should be within the `max-w-[760px]` container, not spanning 1040px.
- Popular searches: switch from vertical list to horizontal chip grid `flex flex-wrap gap-2 max-w-[760px]`
```

---

### 3. Plate Detail — Desktop (1280px)

**Observed from screenshot:**

- The page has a 2-col layout that actually works: left column has seller info + market analysis, right column has escrow box + CTAs. ✅ This is well structured.
- Hero banner spans full width with plate centered — excellent.
- PlateViz (H 3010) is well-centered in the dark teal hero, good size.
- Left col: price (AED 89,000) + "Verified" badge are visible and not clipped — the desktop has room.
- Seller card: avatar + name + "Dubai · Listed 2 days ago" — visible.
- Market Price Analysis: progress bar shows but is quite thin at this width.
- Right col: "Protected by Sakk Escrow" box is in the right column. ✅
- Both CTAs ("Buy Now — Secured by Escrow" + "Gift this Plate") are in the right column — full width of the right col. ✅
- The lower half of the page below the two columns is completely blank — no "similar plates", no content.

**Required desktop fixes:**

```
- Hero: the plate visualization could be larger at desktop — increase PlateViz max-width from ~300px to ~400px
- The 2-col content layout is good — preserve it. Add `gap-8` between the columns.
- Left column needs `max-w-[500px]` to prevent the seller/market cards from stretching too wide.
- Add a "Similar Plates" section at the bottom (below the 2-col block):
  `grid grid-cols-3 xl:grid-cols-4 gap-4` of related plate cards
- Add breadcrumb: `Home / Search / H 3010` in small `text-xs text-sakk-text3` above hero
- The market analysis range bar: at desktop width, add vertical price labels above the bar (min/current/max)
```

---

### 4. Checkout — Desktop (1280px)

**Observed from screenshot:**

- Already uses a 2-col desktop layout! Left: plate summary + payment breakdown. Right: escrow box + payment method + CTA. ✅
- Left col plate card: thumbnail + "Dubai · H 3010" + "Sold by Ahmed Al Rashid" + "Verified seller" — clean, not clipped at desktop.
- Payment breakdown table: "Plate Price / Escrow Fee / Total Payable" — all values visible, no clipping. ✅
- Right col: "Protected by Sakk Escrow" box at top, payment method radio group below, then CTA.
- Plain radio circles (Bank Transfer / Credit/Debit / Apple Pay) are even more noticeable at desktop size.
- "By proceeding you agree to Sakk's escrow terms and transfer disclaimer" is visible, centred below CTA.
- Bottom ~40% of page is blank — but this is OK given the form content ends naturally.

**Required desktop fixes:**

```
- The 2-col layout is solid — just needs polish.
- Left col max-width: `max-w-[540px]` so the breakdown table doesn't look too wide.
- Right col: the escrow box + payment methods + CTA feel disconnected — add a subtle card wrapper:
  `bg-sakk-card border border-sakk-border rounded-2xl p-6 flex flex-col gap-5`
- Payment radio group: at desktop, the card-style payment options (see §4c) will look significantly better.
- Add an order summary sticky behavior: `lg:sticky lg:top-6` on the right column so it stays visible while scrolling left col.
- The blank bottom half: add a "Checkout security" section with 3 trust badges:
  🔒 256-bit encrypted · ✅ RTA verified · 🛡 Escrow protected
```

---

### 5. Escrow Status — Desktop (1280px)

**Observed from screenshot:**

- The page **does NOT use a 2-col layout** — all content is in a single centered column (~600px wide). This is fine for this type of status page.
- The "Funds Secured in Escrow" header card is centered with good proportions.
- Transaction reference block with status chips is visible and not clipped.
- **Timeline is visible and readable at desktop!** Teal circle dots show completed steps (Payment Received ✅, Seller Notified ✅, Transfer in Progress 🔵), and the remaining 2 steps (Verification, Ready to Collect) have grey/faded circles. This is better than the mobile screenshot suggested — the differentiation exists but is still too subtle.
- The amber info box "Seller has 48 hours…" is full-width of the container — fine.
- "Simulate Transfer Confirmed →" dev button is at the very bottom and prominent.

**Required desktop fixes:**

```
- The centered column approach is correct for a status page — keep it.
- Cap the content at `max-w-[640px] mx-auto` to avoid it stretching too wide if viewport is very large.
- Timeline dot differentiation: make the active step dot (Transfer in Progress) larger (16px vs 12px)
  and add a label "IN PROGRESS" in `text-[10px] uppercase tracking-wider text-teal` beside it.
- Add a "Contact Support" link in the top-right of the header card (desktop only):
  `text-teal text-sm hover:underline` — users waiting > 48h may need help.
- At desktop, the amber box could show a clock icon + countdown timer side-by-side:
  Left: warning text | Right: "47h 23m remaining" with teal ring progress circle
```

---

### 6. Transfer Complete — Desktop (1280px)

**Observed from screenshot:**

- The entire page content is **extremely faded/washed out** at desktop — the checkmark circle, heading, body text, cards, and buttons all appear very light/low contrast compared to mobile. This is a real visual regression on desktop.
- Content is centered in a narrow column — fine for a completion page.
- "Back to Home" and "Download Receipt" buttons are visible but appear semi-transparent.
- The "What's next?" card is visible but with very low contrast text.
- The financial summary row (Plate value paid / Funds released) shows but values appear muted.

**Required desktop fixes:**

```
CRITICAL: The entire complete page appears washed out at desktop viewport. Investigate:
- Check if there is a CSS animation (fade-in or scale-in) that is stuck in its initial opacity:0 state
  when rendered at desktop breakpoint — the component may rely on a scroll trigger or JS that
  doesn't fire on initial render at larger viewports.
- Fix: ensure all animation classes use `animation-fill-mode: both` and `forwards` so they complete.
- The `animate-fade-up` or `animate-scale-in` class likely needs `[animation-fill-mode:both]` and
  the `opacity-0` starting state must not persist once the animation ends.
- Add `will-change: opacity, transform` to animated elements.
- Fallback: add `motion-safe:` prefix to animations so non-animated users always see full opacity.
```

---

### 7. Gift Overview — Desktop (1280px)

**Observed from screenshot:**

- Hero with plate visualization spans full width — identical to plate detail page visually.
- Content below uses full-width single column — all cards stretch to 1040px which is too wide.
- "Gift this plate" feature card has teal-light background — visible and spans full width.
- Seller card (Ahmed Al Rashid) also full-width — too stretched.
- Both CTAs are full-width across the entire 1040px content area — buttons are disproportionately wide.

**Required desktop fixes:**

```
- Apply a `max-w-[760px] mx-auto` content wrapper below the hero, just like plate detail.
- OR use the same 2-col layout as plate detail: left = plate info + seller, right = gift card + CTAs
  This would make the gift page feel more like a conversion-focused landing page.
- CTA buttons: cap at `max-w-[400px] mx-auto` so they're not stretching 1040px at desktop.
```

---

### 8. Gift Setup Form — Desktop (1280px)

**Observed from screenshot:**

- The plate thumbnail at top is **very small and left-aligned** — at desktop it looks like an afterthought (tiny 160px plate in the top-left of 1040px content area).
- Form fields (Recipient Name / Personal Message / Date) each stretch the full 1040px — extremely long input fields that look wrong for a form.
- The amber info box also spans the full width.
- "Continue to Payment →" button spans full 1040px — terrible ergonomics.

**Required desktop fixes:**

```
CRITICAL: The gift setup form has no max-width constraint at desktop.
- Wrap the entire form content in `max-w-[600px] mx-auto px-4`
- Plate thumbnail: center it above the form, increase to a reasonable preview size (~240px wide)
- All input fields: they should be comfortable to type in — `max-w-[600px]` is correct
- Button: `max-w-[600px] w-full mx-auto` (full-width within the constrained container, not the viewport)
- Consider 2-col at desktop: left = plate preview + gifting summary, right = form fields
  This provides context (what you're gifting) alongside the form (gift details)
```

---

### 9. Gift Checkout — Desktop (1280px)

**Observed from screenshot:**

- Uses the same 2-col layout as regular checkout! Left: "Gifting to" + plate + payment breakdown. Right: escrow box + "Pay & Send Gift" CTA. ✅
- "Gifting to" section is in the left column as a teal-light card — but the recipient name is empty (just "Gifting to" text with no name).
- The right column has the escrow box + a very prominent "Pay & Send Gift" solid teal button — well placed.
- Footer text "Funds held in Sakk escrow until recipient accepts and transfer is confirmed" visible below CTA.
- No payment method selection visible — this page skips the payment method step (it's shown earlier?).

**Required desktop fixes:**

```
- Same 2-col refinements as regular checkout (§4 desktop fixes).
- CRITICAL: "Gifting to" must show recipient name — "Gifting to Sara" not just "Gifting to".
- Right column: below the "Pay & Send Gift" CTA, add a "Gift journey" mini-timeline:
  You pay → Gift sent to Sara → Sara accepts → Transfer completes
  Style: `flex items-center gap-2 text-xs text-sakk-text3 justify-center mt-3`
- The escrow box on the right could be slightly redesigned for gift context:
  Change "Your payment is held securely" to "Sara receives her gift after accepting it"
```

---

### 10. Estimator — Desktop (1280px)

**Observed from screenshot:**

- The hero banner spans full width — dark teal, "PLATE ESTIMATOR" badge, "What is your plate worth?" heading. Looks great.
- Below the hero: **2-col layout already exists!** Left col: form (Enter plate details + Emirate/Code/Number inputs + button). Right col: results empty state (bar chart icon + "Your estimate will appear here").
- However, the left form column is about 500px wide with a `max-w-[500px]` card — this is good.
- The right results column has the empty state illustration centered — fine.
- The form inputs are well-sized (not stretching the full content width).
- The "Estimate Value" button is within the form card — correct width.
- Bottom ~35% of the page below both columns is blank grey.

**Required desktop fixes:**

```
- The 2-col layout already exists and works well! ✅ Mainly needs polish:
- Add a `divider` between left and right columns: `border-r border-sakk-border` on the left col
  (currently they're just two floating blocks with no visual separation)
- Right col empty state: add example "Try:" quick-fill chips (see §10c)
- Right col results: when estimate appears, the right col should feel like a premium results card
  with a large value, confidence range, and price gauge (see §10d)
- The left form card: label "Enter plate details" is `text-base font-medium` — bump to `text-lg font-semibold`
- Add keyboard shortcut hint on the "Estimate Value" button (desktop only):
  Right side of button: `<span class="hidden lg:inline-flex ...">↵</span>`
```

---

### 11. Gift Reveal — Desktop (1280px)

**Observed from screenshot:**

- Page layout changes significantly at desktop: the dark teal hero section is only in the **top portion** and does not fill the full content area (unlike mobile).
- "YOU RECEIVED A GIFT" badge + "From Ahmed" + plate visualization + personal message are in the teal hero strip.
- Below the hero (on white/grey background): Plate Value card + TCF input section + both CTAs.
- On desktop, all the below-hero content is in a narrow ~500px centered column — actually well-proportioned.
- The hero plate visualization looks small (centered, ~280px) in the 1040px content area — the hero should be more dramatic here.
- "Decline Gift" button stretches to match "Accept Gift & Start Transfer" — both are equal width, but "Decline" should be visually demoted.

**Required desktop fixes:**

```
- The hero: make it taller at desktop — `min-h-[380px]` instead of cramped — the plate reveal
  should feel grand and dramatic, not squeezed into a 200px-tall strip
- Plate visualization: `max-w-[420px]` within the hero so it has more presence
- The personal message: `text-xl` at desktop (larger than mobile's `text-lg`)
- Below-hero content: the `max-w-[520px] mx-auto` constraint is correct — keep it
- "Decline Gift" button: at desktop, demote to `text-sm text-sakk-text3 underline` ghost link
  pushed to the bottom, below a visual separator from "Accept Gift"
```

---

## Desktop Button Stretching — Confirmed Affected Pages

> **Root cause:** Buttons use `w-full` which is correct for mobile, but on desktop there is no `max-w`
> on the button or its parent container. Every CTA stretches to the full ~1040px content area — looks broken.

### Global fix (apply to every primary/secondary CTA button)

```tsx
// ❌ Before — stretches to parent width on desktop:
<button className="w-full bg-teal ...">

// ✅ After — full-width on mobile, capped on desktop:
<button className="w-full lg:max-w-[480px] lg:mx-auto block bg-teal ...">
```

Or apply the constraint to the button's wrapper instead:

```tsx
<div className="lg:max-w-[600px] lg:mx-auto">
  <button className="w-full bg-teal ...">Pay AED 90,500</button>
  <button className="w-full border ...">Gift this Plate</button>
</div>
```

### Affected pages & exact buttons stretching at 1280px

| Page              | Button(s) Stretching                         | Approx Width             | Fix                                                    |
| ----------------- | -------------------------------------------- | ------------------------ | ------------------------------------------------------ |
| **Search**        | "Search Plates"                              | ~1040px                  | Inside `max-w-[760px]` form container                  |
| **Gift Overview** | "Gift this Plate" + "Buy for Myself Instead" | ~1040px                  | `lg:max-w-[480px] lg:mx-auto` on each, or 2-col layout |
| **Gift Setup**    | "Continue to Payment →"                      | ~1040px                  | Inside `max-w-[600px]` form card                       |
| **Escrow**        | "Simulate Transfer Confirmed →"              | ~580px (OK — narrow col) | Dev-only; gate behind `NODE_ENV`                       |
| **Complete**      | "Back to Home" + "Download Receipt"          | ~480px (OK — narrow col) | Fix fade animation bug first                           |
| **Gift Reveal**   | "Accept Gift & Start Transfer"               | ~520px (OK — narrow col) | Demote "Decline Gift" to ghost link                    |

> Pages with an existing 2-col layout (Checkout, Gift Checkout, Plate Detail) already scope their buttons
> to the right column (~460px) — these do **not** need the fix.

### Button max-width rule by context

```
Primary CTA (standalone):       lg:max-w-[480px] lg:mx-auto
Primary + secondary pair:       lg:max-w-[480px] on both, inside a shared wrapper
Form submit (inside form card):  w-full within the form's own max-width container
Destructive / demoted action:   ghost link on desktop — no max-w needed
```

---

## Desktop Layout Summary Table

| Page          | Mobile Layout              | Desktop Layout (Observed)          | Verdict       | Key Fix                                                    |
| ------------- | -------------------------- | ---------------------------------- | ------------- | ---------------------------------------------------------- |
| Home          | Single col                 | Single col, hero + content below   | ❌ Broken     | Add max-width wrapper, fix grid cols for cards             |
| Search        | Single col, stacked        | Single col, full-width form        | ❌ Poor       | 2-col layout or max-width form, **cap button width**       |
| Plate Detail  | Single col                 | 2-col (info left / CTA right)      | ✅ Good       | Polish gaps, add similar plates below                      |
| Checkout      | Single col                 | 2-col (breakdown left / CTA right) | ✅ Good       | Card wrap the right col, sticky right                      |
| Escrow        | Single col                 | Single col, centered               | ✅ OK         | Max-width cap, contact support link                        |
| Complete      | Single col                 | Single col, centered — **FADED**   | ❌ Bug        | Fix animation fill-mode, restore full opacity              |
| Gift Overview | Single col                 | Full-width single col              | ❌ Poor       | Max-width wrapper or 2-col, **cap buttons to 480px**       |
| Gift Setup    | Single col                 | Full-width, no max-width           | ❌ Broken     | `max-w-[600px]` form wrapper + **button inside container** |
| Gift Checkout | Single col                 | 2-col (same as checkout)           | ✅ Good       | Show recipient name, polish CTA col                        |
| Estimator     | Single col                 | 2-col (form left / results right)  | ✅ Good       | Add col divider, polish results state                      |
| Gift Reveal   | Single col, immersive hero | Hero strip + narrow centered body  | ⚠️ Needs work | Taller hero, larger plate viz                              |
