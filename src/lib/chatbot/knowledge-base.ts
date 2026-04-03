/**
 * Madmoon AI Chatbot — Local Knowledge Base
 *
 * This file is the single source of truth for the chatbot.
 * All content is fed into the OpenAI system prompt so the bot
 * only answers questions about Madmoon and navigates within the app.
 */

export const SAKK_KNOWLEDGE_BASE = `
# About Madmoon

Madmoon — is a UAE-based digital marketplace for buying, selling, auctioning, and gifting vehicle licence plates. The platform's core promise is trust: every transaction is secured through an escrow engine that holds funds until the official RTA plate transfer is verified and complete. Madmoon is the only fully safe, end-to-end digital channel to discover, purchase, transfer, or gift plates in the UAE.

**Tagline:** Your deal. Your deed. / صك لكل صفقة  
**Primary colour:** Teal #0CBFB8  
**Website:** sakk.ae / sakk.com

## The Problem Madmoon Solves
Vehicle plate transfers in the UAE currently happen without secured payment, exposing buyers and sellers to fraud. Existing platforms (SHUB, PlateMarket) offer discovery but zero payment protection — transactions happen off-platform via unprotected bank transfers or cash. Madmoon fixes this with an e-escrow engine.

---

# App Features & Pages

## Home (/home)
The main feed after logging in. Shows:
- Car / Bike / Boat category tabs (Bike and Boat coming soon)
- Featured plate listings
- Live auction previews
- Quick access to post a listing, search, and explore

To reach home after login, tap the Home tab in the bottom navigation.

## Landing Page (/)
The marketing/entry page for new visitors. Shows a hero banner, featured plates, and a search bar to get started. Sign up or log in to access the full marketplace.

## Search (/search)
Browse and filter all available plates:
- **Search bar**: Enter a number, birthday, lucky digits, etc.
- **Filters**: Emirate, digit count (1–6 digits), text query
- Results show in a grid with price, emirate, seller info
- Popular searches: 786, 1234, 5555, 1001
- Advanced search tips: birthday numbers (e.g. 010190), mirror numbers (1221), repeating digits (7777), sequential (1234)

## Auctions (/auctions)
Browse all live auctions. Features:
- **Tabs**: Ending Soon / Newly Listed / All / Premium Only
- Shows live countdown timers, current bid, bid history snippets
- Urgency banner highlights auctions ending in < 2 hours

## Plate Detail (/plates/[id])
The full listing page for any plate:
- Large plate visual (gold or silver, emirate-accurate)
- Current price, escrow fee, market price analysis (Below / Fair / Above Market gauge)
- Verified seller info
- For **auctions**: live countdown, current bid, bid history, Place Bid CTA
- For **fixed-price**: Buy Now and Gift This Plate CTAs
- Escrow protection banner

## Place a Bid (/plates/[id]/auction/bid)
- Shows current bid and the minimum next bid (with bid increment)
- Live countdown timer
- Enter your bid amount (must be ≥ minimum)
- On success, you are taken to the watching screen
- Authentication required to place bids

## Watch Auction (/plates/[id]/auction/watching)
- Post-bid live watching screen
- Shows whether you are currently leading
- Full bid history with real-time updates
- Quick-increment buttons: +500, +1,000, +5,000 AED
- Redirects to bid page with preset amount for quick re-bids

## Auction Won (/plates/[id]/auction/won)
- Congratulations screen after winning
- Shows winning bid, escrow fee, total due
- CTA: Proceed to Payment → checkout

## Checkout (/plates/[id]/checkout)
- Order summary: plate preview, price, escrow fee, total payable
- Payment method: Bank Transfer (others coming soon)
- 2-second processing simulation → bank transfer details

## Bank Transfer (/plates/[id]/checkout/bank-transfer)
- Madmoon Escrow Account (Emirates NBD)
- Shows account name, IBAN, SWIFT code, transaction reference
- Copy-to-clipboard buttons for all details
- "Simulate Transfer" moves to escrow tracking

## Escrow Status (/plates/[id]/checkout/escrow)
- 5-step live escrow tracker:
  1. Payment Received ✓
  2. Seller Notified ✓
  3. Transfer in Progress (active)
  4. Verification
  5. Ready to Collect
- Shows progress and current active step

## Transfer Complete (/plates/[id]/checkout/complete)
- Final success screen confirming plate is officially transferred
- Shows transaction reference (SKK-2024-XXXXX)
- Download certificate option
- Back to Home navigation

## Gift a Plate
Gifting is a multi-step flow:

1. **Gift Entry (/plates/[id]/gift)** — Start gifting a plate. Shows plate value and "Gift This Plate" CTA.
2. **Gift Setup (/plates/[id]/gift/setup)** — Enter recipient's full name, personal message (max 140 chars), optional delivery date.
3. **Gift Checkout (/plates/[id]/gift/checkout)** — Order summary with recipient name, message, plate price, escrow fee, total. Pay to send.
4. **Gift Reveal (/gift/reveal)** — The recipient's page. They see who gifted them, the plate, the personal message, and must enter their Traffic Code File (TCF) number (min 6 digits) to accept the transfer.

## Plate Value Estimator (/estimator)
Interactive tool to estimate a plate's market value:
- Inputs: Emirate, Plate Code/Letter, Plate Number
- Outputs: Estimated price range (e.g. AED 85,000 – 110,000)
- Shows demand, rarity, and liquidity metrics
- Market range gauge with fair value zone
- Comparable recent sales examples
- CTAs: "Find similar plates" (pre-fills search), "List at this price"

## Notifications (/notifications)
User notification inbox:
- Outbid alerts, auction ending soon, auction won, price drop, sale complete, gift received
- Mark individual or all as read
- Requires login

## Profile (/profile)
- User stats: sales, purchases, rating
- Account settings: verification status, wallet balance, payment methods
- Dark/light theme toggle
- Logout

---

# Escrow System

## How Escrow Works
Madmoon uses an e-escrow engine. Funds NEVER move directly from buyer to seller.

**Flow:**
1. Buyer pays → funds go into Madmoon escrow
2. Seller initiates RTA transfer
3. Transfer is verified
4. Funds released to seller; escrow fee retained by Madmoon

**If anything goes wrong:** Full refund to buyer including escrow fee.

## Transaction States
| State | Meaning |
|---|---|
| RESERVED | Buyer started checkout; listing locked; no funds moved |
| ESCROW_FUNDED | Buyer paid; full amount held; seller notified |
| TRANSFER_IN_PROGRESS | Seller started RTA transfer |
| VERIFICATION_IN_PROGRESS | Seller submitted proof; awaiting confirmation |
| COMPLETED | Transfer confirmed; plate value released to seller |
| CANCELLED | SLA breach or buyer cancelled; full refund |
| TRANSFER_FAILED | RTA rejected; funds held; case reviewed |
| UNDER_DISPUTE | Dispute raised; funds frozen; manual review |

## Buyer Status Labels
Awaiting Payment → Escrow Funded → Seller Preparing Transfer → Transfer in Progress → Verification in Progress → Ready for Collection → Cancelled / Refunded / Under Dispute

## Seller Status Labels
Buyer Payment Pending → Action Required → Transfer in Progress → Verification in Progress → Paid Out → Cancelled / Under Dispute

---

# Fees

## Escrow Fee Tiers
| Tier | Plate Value | Escrow Fee |
|---|---|---|
| Entry | AED 2,000 – 5,000 | AED 250 |
| Budget | AED 5,000 – 10,000 | AED 500 |
| Mid-range | AED 10,000 – 50,000 | AED 1,000 |
| Upper-mid | AED 50,000 – 100,000 | AED 1,500 |
| Premium | AED 100,000 – 999,000 | AED 2,000 |
| Elite | AED 1,000,000+ | AED 5,000 |

The escrow fee is a flat fixed amount per tier — Madmoon does NOT take a percentage of the plate value. There are no hidden fees.

---

# Plates on Madmoon

## Plate Types
- **Gold** — Dubai gold-background plates
- **Silver** — Standard silver plates
- **Abu Dhabi** — Abu Dhabi plates
- **Sharjah** — Sharjah plates

## Emirates Supported
Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain

## What Makes a Plate Valuable?
- Fewer digits (1-digit plates are extremely rare, 2–3 digits are premium)
- Repeating numbers (7777, 5555) — high demand
- Sequential numbers (1234, 5678)
- Lucky digits (786 — significant in Arab culture)
- Mirror numbers (1221, 3443)
- Birthday numbers (e.g. 010190)
- Single-letter codes
- Low numbers for prestigious emirates (e.g. Dubai 1, 2, 3)

---

# Seller Features

## Verifying as a Seller
Sellers must be verified before any listing goes live. Required uploads:
- Emirates ID (front and back)
- Mulkiya / RTA ownership certificate
- TCF (Traffic Code File) number
- Selfie with Emirates ID

Verification states: PENDING → UNDER_REVIEW → VERIFIED (or REJECTED with reason)

## Listing a Plate
- Post via the "+" button in the bottom navigation (Profile → Post Listing)
- Set listing type: Fixed Price or Auction
- Option to enable Quick Sale flag for faster visibility
- Option to boost listing for promoted placement

## Seller Dashboard
Active listings, pending transfers, completed sales, earnings — all accessible from Profile.

---

# Auctions Deep Dive

## How Auctions Work
1. Sellers list a plate as an auction with a start price and end time
2. Buyers place bids — each bid must be higher than the current bid + minimum increment
3. The highest bidder when the timer ends wins the plate
4. Winner proceeds through the standard escrow checkout flow
5. Funds are held in escrow until RTA transfer is verified

## Bid Increments
The platform suggests minimum bid amounts with auto-calculated increments. The bid placement screen shows the minimum next bid clearly.

## Real-time Updates
Auction pages use real-time Firestore subscriptions — bids and prices update live without page refresh.

---

# Market Statistics
- UAE plate transfer market: ~80,000 transactions per year
- At 10% market share: ~8,000 transactions / AED 6.66M annual escrow revenue
- Most listings are Car Plates (v1 focus)
- Bike Plates and Boat Numbers coming soon

---

# Navigation Guide (for the chatbot to use)

If a user asks to go somewhere, use these paths:
| User Intent | Route |
|---|---|
| Go home / main feed | /home |
| Search for plates | /search |
| Browse auctions | /auctions |
| Estimate plate value | /estimator |
| My notifications | /notifications |
| My profile / account | /profile |
| Landing / marketing page | / |

For specific plates, the path is /plates/[id] where [id] is the plate ID.

---

# FAQs

**Q: Is Madmoon safe?**
A: Yes. Madmoon uses an e-escrow engine — your funds are never sent directly to the seller. Money is held securely until the RTA plate transfer is officially confirmed.

**Q: What payment methods are accepted?**
A: Currently Bank Transfer. Card and Apple Pay are coming soon.

**Q: How long does a transfer take?**
A: The target SLA is 48 hours from escrow funded to transfer initiated. Total end-to-end time depends on RTA processing.

**Q: Can I cancel a purchase?**
A: Yes, buyers can cancel before the seller initiates the RTA transfer. A full refund including escrow fee is issued.

**Q: What if there's a dispute?**
A: Open a dispute from your transaction page. Funds are frozen and Madmoon's operations team reviews manually. Target dispute rate is below 2%.

**Q: How do I gift a plate?**
A: Open any plate listing, tap "Gift This Plate", fill in the recipient's name and optional message, pay, and Madmoon sends the recipient a personalised reveal link. The recipient enters their TCF number to accept the transfer.

**Q: Do I need to verify my identity to buy?**
A: You need to be registered and logged in. Sellers need full verification. Buyers need basic account setup.

**Q: Are there listing fees?**
A: Currently no listing fees. Revenue comes from escrow fees only. Listing fees and featured placements are planned for future versions.

**Q: What is a TCF number?**
A: TCF stands for Traffic Code File. It's your unique identifier with UAE traffic authorities (RTA) — required for plate ownership transfers.

**Q: Can I buy plates from all emirates?**
A: Yes. Madmoon lists plates from all 7 UAE emirates: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.

**Q: Is Madmoon available outside the UAE?**
A: Currently UAE only. GCC expansion (Saudi Arabia, Qatar, Kuwait, Bahrain, Oman) is planned.

**Q: How do I contact Madmoon support?**
A: Support contact options are available on the Profile page. Email support@madmoon.ae.

**Q: What does "Boosted" or "Quick Sale" mean?**
A: Quick Sale listings are from sellers wanting a fast exit — often priced below market. Boosted listings are promoted for higher visibility.
`;

export const SYSTEM_PROMPT = (currentPage: string) => `
You are Madmoon AI — the friendly, helpful AI assistant built into the Madmoon plate marketplace app.

The user is currently on: ${currentPage}

## Your Capabilities
1. Answer ANY question about Madmoon — what it is, how it works, its features, fees, escrow, auctions, gifting, plate values, etc.
2. Welcome and orient new users who ask general questions like "what is this?", "what can I do here?", "how does this work?" — these are valid and common
3. Guide users to the right page within the app by including a navigation action
4. Give step-by-step guidance for any Madmoon process (bidding, buying, selling, gifting, escrow, etc.)
5. Use the get_page_context tool whenever the user asks what they can do, what they see, or needs UI guidance on their current page

## Navigation
When a user wants to go to a specific section, include a JSON navigation block at the END of your message in this exact format:
<nav>{"path":"/auctions","label":"Browse Auctions"}</nav>

Only include one navigation block per message. Only include it when the user explicitly wants to go somewhere or when it would clearly help them.

## Tone
- Friendly, warm, and concise
- Use simple language — assume users may be new to the app
- Keep responses short unless detail is genuinely needed
- Use AED for currency

## Rules
- Answer all questions about Madmoon enthusiastically — including "what is this site?", "who is this for?", "what can I do here?" etc.
- Do NOT make up plate prices, specific listings, or user account data
- Only decline if the question is completely unrelated to Madmoon AND to UAE plate marketplace topics (e.g. cooking recipes, sports scores) — in that case politely say you can only help with Madmoon questions
- If you don't know a specific detail, say "I don't have that information right now — please contact support@madmoon.ae"

## Knowledge Base
${SAKK_KNOWLEDGE_BASE}
`;

export const QUICK_REPLIES_BY_PAGE: Record<string, string[]> = {
  "/": [
    "How does Madmoon work?",
    "Is it safe to buy here?",
    "Browse auctions",
    "What are the fees?",
  ],
  "/home": [
    "How do I post a listing?",
    "Browse auctions",
    "How does escrow work?",
    "Gift a plate",
  ],
  "/auctions": [
    "How do auctions work?",
    "What happens if I win?",
    "What is the bid increment?",
    "How do I watch an auction?",
  ],
  "/search": [
    "What makes a plate valuable?",
    "Tips for finding lucky numbers",
    "How do I filter by emirate?",
    "What digit counts are available?",
  ],
  "/estimator": [
    "How is the estimate calculated?",
    "What affects plate value?",
    "How do I list at this price?",
  ],
  default: [
    "How does Madmoon work?",
    "What are the escrow fees?",
    "How do I buy a plate?",
    "How do auctions work?",
  ],
};

export function getQuickReplies(pathname: string): string[] {
  return QUICK_REPLIES_BY_PAGE[pathname] ?? QUICK_REPLIES_BY_PAGE["default"];
}

// ─── Page Context Tool ────────────────────────────────────────────────────────

export interface PageContext {
  title: string;
  description: string;
  visibleElements: string[];
  availableActions: string[];
  tips: string[];
}

export const PAGE_CONTEXT_MAP: Record<string, PageContext> = {
  "/": {
    title: "Landing Page",
    description: "The Madmoon marketing/entry page for new visitors.",
    visibleElements: [
      "Hero banner",
      "Featured plate listings",
      "Search bar",
      "Sign up / Log in buttons",
    ],
    availableActions: [
      "Search for a plate",
      "Sign up",
      "Log in",
      "Tap a featured plate",
    ],
    tips: ["Sign up is free — you need an account to place bids or buy plates"],
  },
  "/home": {
    title: "Home Feed",
    description: "Main discovery feed shown after login.",
    visibleElements: [
      "Category tabs: Car / Bike / Boat",
      "Featured plate cards",
      "Live auction previews",
      "Bottom navigation",
    ],
    availableActions: [
      "Tap a plate card",
      "Tap Auctions tab",
      "Tap + to list your plate",
      "Tap Search",
    ],
    tips: ["Plates with a countdown timer are live auctions — tap to bid"],
  },
  "/search": {
    title: "Search & Browse",
    description: "Filter and search all available plate listings.",
    visibleElements: [
      "Search input bar",
      "Emirate filter",
      "Digit count filter",
      "Listing type toggle",
      "Results grid",
    ],
    availableActions: [
      "Type a number in the search bar",
      "Filter by emirate",
      "Filter by digit count",
      "Tap a result to view the plate",
    ],
    tips: [
      "Try popular searches: 786, 1234, 5555, 1001",
      "Mirror numbers (1221) and repeating digits (7777) tend to be premium",
    ],
  },
  "/auctions": {
    title: "Auctions",
    description: "Live auction listings with real-time countdowns.",
    visibleElements: [
      "Tabs: Ending Soon / Newly Listed / All / Premium Only",
      "Auction cards with countdown, current bid, bid count",
    ],
    availableActions: ["Switch tabs to filter", "Tap an auction card to bid"],
    tips: [
      "'Ending Soon' tab shows auctions expiring in the next 2 hours",
      "You must be logged in to place a bid",
    ],
  },
  "/estimator": {
    title: "Plate Value Estimator",
    description: "Estimate the market value of any UAE plate.",
    visibleElements: [
      "Emirate selector",
      "Plate Code input",
      "Plate Number input",
      "Estimate button",
      "Price range result",
      "Market gauge",
    ],
    availableActions: [
      "Select emirate",
      "Enter plate code and number",
      "Tap Estimate",
      "Tap 'Find similar plates'",
      "Tap 'List at this price'",
    ],
    tips: [
      "Fewer digits = higher value",
      "Repeating numbers like 7777 have strong demand",
    ],
  },
  "/notifications": {
    title: "Notifications",
    description: "Your notification inbox.",
    visibleElements: [
      "Notification list",
      "Mark All Read button",
      "Unread count badge",
    ],
    availableActions: [
      "Tap a notification to navigate to the listing",
      "Tap Mark All Read",
    ],
    tips: [
      "Outbid notifications are time-sensitive — tap quickly to counter-bid",
    ],
  },
  "/profile": {
    title: "Profile & Settings",
    description: "Your account overview, stats, and preferences.",
    visibleElements: [
      "Avatar, display name, email",
      "Stats: Sales, Purchases, Rating",
      "Verification Status, Wallet Balance, Payment Methods",
      "Dark/Light mode toggle",
      "Madmoon AI Assistant toggle",
      "Log Out button",
    ],
    availableActions: [
      "Toggle Dark/Light mode",
      "Enable or disable the Madmoon AI chatbot",
      "Check verification status",
      "Log Out",
    ],
    tips: [
      "You must be verified to list plates for sale",
      "The Madmoon AI toggle here controls whether the chat button appears",
    ],
  },
};

export function getPageContext(pathname: string): PageContext | null {
  const clean = pathname.split("?")[0].split("#")[0];
  if (PAGE_CONTEXT_MAP[clean]) return PAGE_CONTEXT_MAP[clean];

  if (clean.startsWith("/plates/") && clean.endsWith("/auction/bid")) {
    return {
      title: "Place a Bid",
      description: "Real-time bid placement screen for an active auction.",
      visibleElements: [
        "Plate visual with current bid",
        "Live countdown timer",
        "Minimum next bid amount",
        "Bid amount input",
        "Place Bid button",
      ],
      availableActions: [
        "Enter a bid amount ≥ the minimum shown",
        "Tap Place Bid to submit",
      ],
      tips: [
        "Your bid must be at least the minimum shown",
        "After bidding you will be taken to the watching screen",
      ],
    };
  }
  if (clean.startsWith("/plates/") && clean.endsWith("/auction/watching")) {
    return {
      title: "Watching Auction",
      description:
        "Live auction watch screen tracking your position in real-time.",
      visibleElements: [
        "Live countdown",
        "Your status: Leading / Outbid",
        "Current highest bid",
        "Bid history",
        "Quick increment buttons: +500, +1,000, +5,000 AED",
      ],
      availableActions: [
        "Tap a quick increment button for a counter-bid",
        "Tap Re-bid to go back to the bid screen",
      ],
      tips: [
        "Use the +500/+1000/+5000 buttons if you are outbid",
        "Page updates live — no need to refresh",
      ],
    };
  }
  if (
    clean.startsWith("/plates/") &&
    clean.endsWith("/checkout/bank-transfer")
  ) {
    return {
      title: "Bank Transfer Details",
      description:
        "Madmoon escrow bank account details for completing payment.",
      visibleElements: [
        "Madmoon Escrow Account name",
        "Bank: Emirates NBD",
        "IBAN (copy button)",
        "SWIFT code (copy button)",
        "Transaction reference (copy button)",
      ],
      availableActions: [
        "Copy IBAN, SWIFT, or reference to clipboard",
        "Make the bank transfer using these details",
      ],
      tips: [
        "Include the transaction reference in the bank transfer remarks",
        "Funds go to Madmoon escrow — not directly to the seller",
      ],
    };
  }
  if (clean.startsWith("/plates/") && clean.endsWith("/checkout/escrow")) {
    return {
      title: "Escrow Tracker",
      description: "5-step live escrow status tracker.",
      visibleElements: [
        "Step 1: Payment Received",
        "Step 2: Seller Notified",
        "Step 3: Transfer in Progress",
        "Step 4: Verification",
        "Step 5: Ready to Collect",
      ],
      availableActions: ["Wait for each step — updates are automatic"],
      tips: [
        "If transfer is delayed beyond SLA, Madmoon support will contact you",
        "Full refund if anything goes wrong",
      ],
    };
  }
  if (clean.startsWith("/plates/") && clean.includes("/checkout")) {
    return {
      title: "Checkout",
      description: "Order summary and payment initiation screen.",
      visibleElements: [
        "Plate preview",
        "Plate price (AED)",
        "Escrow fee",
        "Total payable",
        "Proceed to Payment button",
      ],
      availableActions: ["Review order summary", "Tap Proceed to Payment"],
      tips: ["The escrow fee is a flat amount — not a percentage"],
    };
  }
  if (clean.startsWith("/plates/")) {
    return {
      title: "Plate Detail",
      description: "Full listing page for a specific plate.",
      visibleElements: [
        "Plate visual",
        "Price or current bid",
        "Market price gauge",
        "Verified seller info",
        "Escrow protection banner",
        "Place Bid / Buy Now / Gift This Plate buttons",
      ],
      availableActions: [
        "Tap Place Bid to bid",
        "Tap Buy Now to purchase",
        "Tap Gift This Plate to gift",
        "Add to watchlist",
      ],
      tips: [
        "All purchases go through Madmoon escrow — funds are never sent directly to the seller",
        "You must be logged in to buy or bid",
      ],
    };
  }
  return null;
}
