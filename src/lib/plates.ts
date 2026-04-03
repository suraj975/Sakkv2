import type { Plate, Bid } from "@/types";

export const PLATES: Plate[] = [
  {
    id: 1,
    code: "H",
    num: "3010",
    price: 89000,
    emirate: "Dubai",
    type: "gold",
    verified: true,
    seller: "Ahmed Al Rashid",
    days: 2,
    listingType: "auction",
    auctionEndTime: "2025-08-22T14:38:00.000Z",
    currentBid: 47500,
    bidCount: 12,
    minBidIncrement: 1500,
    lotNumber: 8291,
  },
  {
    id: 2,
    code: "W",
    num: "20110",
    price: 27500,
    orig: 32000,
    emirate: "Dubai",
    type: "silver",
    verified: true,
    seller: "Salem Trading",
    days: 5,
  },
  {
    id: 3,
    code: "R",
    num: "11001",
    price: 179000,
    emirate: "Dubai",
    type: "gold",
    verified: true,
    seller: "Elite Plates LLC",
    days: 1,
    listingType: "auction",
    auctionEndTime: "2025-08-27T10:00:00.000Z",
    currentBid: 165000,
    bidCount: 8,
    minBidIncrement: 5000,
    lotNumber: 8292,
  },
  {
    id: 4,
    code: "R",
    num: "15154",
    price: 14900,
    emirate: "Dubai",
    type: "gold",
    verified: false,
    seller: "Khalid M.",
    days: 8,
  },
  {
    id: 5,
    code: "7",
    num: "88939",
    price: 34500,
    emirate: "Abu Dhabi",
    type: "abudhabi",
    verified: false,
    seller: "Hamad Al Kaabi",
    days: 3,
  },
  {
    id: 6,
    code: "3",
    num: "8798",
    price: 20500,
    orig: 21500,
    emirate: "Sharjah",
    type: "sharjah",
    verified: false,
    seller: "Plates Hub",
    days: 6,
  },
  {
    id: 7,
    code: "A",
    num: "786",
    price: 245000,
    emirate: "Dubai",
    type: "gold",
    verified: true,
    seller: "Golden Plates",
    days: 1,
    listingType: "auction",
    auctionEndTime: "2025-08-15T23:00:00.000Z",
    currentBid: 220000,
    bidCount: 19,
    minBidIncrement: 5000,
    lotNumber: 8293,
  },
  {
    id: 8,
    code: "P",
    num: "1234",
    price: 8500,
    emirate: "Dubai",
    type: "silver",
    verified: true,
    seller: "Quick Plates",
    days: 4,
    listingType: "auction",
    auctionEndTime: "2025-09-01T08:35:00.000Z",
    currentBid: 7500,
    bidCount: 5,
    minBidIncrement: 250,
    lotNumber: 8294,
  },
  {
    id: 9,
    code: "5",
    num: "50005",
    price: 42000,
    emirate: "Abu Dhabi",
    type: "abudhabi",
    verified: true,
    seller: "Capital Plates",
    days: 2,
  },
  {
    id: 10,
    code: "M",
    num: "786",
    price: 18000,
    orig: 22000,
    emirate: "Sharjah",
    type: "sharjah",
    verified: false,
    seller: "Sharjah Plates",
    days: 7,
  },
];

export function getPlateById(id: number | string): Plate | undefined {
  return PLATES.find((p) => p.id === Number(id));
}

export function getAuctionPlates(): Plate[] {
  const now = Date.now();
  // Offsets: 2d 14h, 0d 5h, 1d 8h, 3d 21h — always in the future
  const offsets = [
    (2 * 24 + 14) * 60 * 60 * 1000,
    5 * 60 * 60 * 1000,
    (1 * 24 + 8) * 60 * 60 * 1000,
    (3 * 24 + 21) * 60 * 60 * 1000,
  ];
  return PLATES.filter((p) => p.listingType === "auction").map((p, i) => ({
    ...p,
    auctionEndTime: new Date(now + (offsets[i] ?? offsets[0])).toISOString(),
  }));
}

export function escrowFee(price: number): number {
  if (price <= 5000) return 250;
  if (price <= 10000) return 500;
  if (price <= 50000) return 1000;
  if (price <= 100000) return 1500;
  if (price <= 999999) return 2000;
  return 5000;
}

export function priceTier(price: number): string {
  if (price <= 5000) return "Entry";
  if (price <= 10000) return "Budget";
  if (price <= 50000) return "Mid-range";
  if (price <= 100000) return "Upper-mid";
  if (price <= 999999) return "Premium";
  return "Elite";
}

export function aed(n: number): string {
  return "AED " + Math.round(n).toLocaleString();
}

export function aedCompact(n: number): string {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `AED ${Math.round(n / 1_000)}K`;
  return `AED ${Math.round(n)}`;
}

export function timeRemaining(endTime: string): {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  total: number;
} {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, total: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, mins, secs, total: diff };
}

export function minNextBid(currentBid: number, increment: number): number {
  return currentBid + increment;
}

export const MOCK_BIDS: Record<number, Bid[]> = {
  1: [
    {
      bidderInitials: "JD",
      bidderAlias: "Jassim D.",
      amount: 47500,
      time: "2 min ago",
      isLeading: true,
    },
    {
      bidderInitials: "AR",
      bidderAlias: "Ahmed R.",
      amount: 46000,
      time: "8 min ago",
    },
    {
      bidderInitials: "SL",
      bidderAlias: "Sultan L.",
      amount: 44500,
      time: "15 min ago",
    },
    {
      bidderInitials: "MK",
      bidderAlias: "M. Khalid",
      amount: 43000,
      time: "22 min ago",
    },
    {
      bidderInitials: "HA",
      bidderAlias: "Hamad A.",
      amount: 41500,
      time: "35 min ago",
    },
  ],
  3: [
    {
      bidderInitials: "FA",
      bidderAlias: "Fahad A.",
      amount: 165000,
      time: "5 min ago",
      isLeading: true,
    },
    {
      bidderInitials: "ZK",
      bidderAlias: "Zayed K.",
      amount: 160000,
      time: "18 min ago",
    },
    {
      bidderInitials: "OM",
      bidderAlias: "Omar M.",
      amount: 155000,
      time: "30 min ago",
    },
    {
      bidderInitials: "NR",
      bidderAlias: "Nasser R.",
      amount: 150000,
      time: "45 min ago",
    },
  ],
  7: [
    {
      bidderInitials: "YA",
      bidderAlias: "You",
      amount: 220000,
      time: "1 min ago",
      isLeading: true,
    },
    {
      bidderInitials: "ID",
      bidderAlias: "ID 8291",
      amount: 215000,
      time: "6 min ago",
    },
    {
      bidderInitials: "ID",
      bidderAlias: "ID 1024",
      amount: 210000,
      time: "14 min ago",
    },
    {
      bidderInitials: "SC",
      bidderAlias: "S. Checker",
      amount: 205000,
      time: "21 min ago",
    },
  ],
  8: [
    {
      bidderInitials: "AK",
      bidderAlias: "A. Khan",
      amount: 7500,
      time: "3 min ago",
      isLeading: true,
    },
    {
      bidderInitials: "JL",
      bidderAlias: "J. Lee",
      amount: 7250,
      time: "12 min ago",
    },
    {
      bidderInitials: "MB",
      bidderAlias: "M. Bilal",
      amount: 7000,
      time: "29 min ago",
    },
  ],
};
