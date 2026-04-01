/**
 * Sakk Firebase Seed Script
 *
 * Populates Firestore with demo users, plates, bids, transactions, and gifts.
 *
 * Usage:
 *   npx ts-node --project tsconfig.seed.json scripts/seed-firebase.ts
 *
 * Requirements:
 *   - Firebase project must be set up (sakk-f314c)
 *   - Script uses Firebase client SDK with demo credentials
 *   - Run once; re-running will add duplicate docs (check for existing data first)
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8VJGP9f4Y__cvzhEuH4uI8ohzg6aIzx4",
  authDomain: "sakk-f314c.firebaseapp.com",
  projectId: "sakk-f314c",
  storageBucket: "sakk-f314c.firebasestorage.app",
  messagingSenderId: "1043224658504",
  appId: "1:1043224658504:web:59350cedad684980f38e7d",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// ─── Helpers ────────────────────────────────────────────────────────────────

function ts(isoString: string) {
  return Timestamp.fromDate(new Date(isoString));
}

function now() {
  return Timestamp.now();
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return Timestamp.fromDate(d);
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return Timestamp.fromDate(d);
}

// ─── Dummy Users ─────────────────────────────────────────────────────────────

const DEMO_PASSWORD = "Sakk@demo2025";

const DEMO_USERS = [
  {
    id: "user_ahmed",
    displayName: "Ahmed Al Rashid",
    email: "ahmed@sakk.demo",
    emirate: "Dubai",
    isVerified: true,
    isTrustedSeller: true,
    totalSales: 14,
    totalPurchases: 3,
    rating: 4.9,
    reviewCount: 11,
    walletBalance: 12000,
  },
  {
    id: "user_salem",
    displayName: "Salem Trading",
    email: "salem@sakk.demo",
    emirate: "Dubai",
    isVerified: true,
    isTrustedSeller: true,
    totalSales: 28,
    totalPurchases: 0,
    rating: 4.7,
    reviewCount: 25,
    walletBalance: 35000,
  },
  {
    id: "user_khalid",
    displayName: "Khalid M.",
    email: "khalid@sakk.demo",
    emirate: "Abu Dhabi",
    isVerified: false,
    isTrustedSeller: false,
    totalSales: 2,
    totalPurchases: 5,
    rating: 4.2,
    reviewCount: 2,
    walletBalance: 5000,
  },
  {
    id: "user_hamad",
    displayName: "Hamad Al Kaabi",
    email: "hamad@sakk.demo",
    emirate: "Abu Dhabi",
    isVerified: false,
    isTrustedSeller: false,
    totalSales: 0,
    totalPurchases: 7,
    rating: 0,
    reviewCount: 0,
    walletBalance: 8500,
  },
  {
    id: "user_fatima",
    displayName: "Fatima Al Marri",
    email: "fatima@sakk.demo",
    emirate: "Sharjah",
    isVerified: false,
    isTrustedSeller: false,
    totalSales: 1,
    totalPurchases: 4,
    rating: 5.0,
    reviewCount: 1,
    walletBalance: 2000,
  },
  {
    id: "user_omar",
    displayName: "Omar Al Mazrouei",
    email: "omar@sakk.demo",
    emirate: "Dubai",
    isVerified: true,
    isTrustedSeller: true,
    totalSales: 32,
    totalPurchases: 8,
    rating: 4.8,
    reviewCount: 29,
    walletBalance: 55000,
  },
  {
    id: "user_rania",
    displayName: "Rania Investments",
    email: "rania@sakk.demo",
    emirate: "Abu Dhabi",
    isVerified: true,
    isTrustedSeller: true,
    totalSales: 19,
    totalPurchases: 2,
    rating: 4.6,
    reviewCount: 17,
    walletBalance: 28000,
  },
  {
    id: "user_tariq",
    displayName: "Tariq Al Suwaidi",
    email: "tariq@sakk.demo",
    emirate: "Sharjah",
    isVerified: false,
    isTrustedSeller: false,
    totalSales: 3,
    totalPurchases: 6,
    rating: 4.3,
    reviewCount: 3,
    walletBalance: 9200,
  },
  {
    id: "user_noura",
    displayName: "Noura Al Zaabi",
    email: "noura@sakk.demo",
    emirate: "Ajman",
    isVerified: false,
    isTrustedSeller: false,
    totalSales: 0,
    totalPurchases: 2,
    rating: 0,
    reviewCount: 0,
    walletBalance: 3500,
  },
  {
    id: "user_faisal",
    displayName: "Faisal Premium Plates",
    email: "faisal@sakk.demo",
    emirate: "Dubai",
    isVerified: true,
    isTrustedSeller: true,
    totalSales: 47,
    totalPurchases: 12,
    rating: 4.95,
    reviewCount: 43,
    walletBalance: 120000,
  },
];

// ─── Seed Plates ─────────────────────────────────────────────────────────────

const PLATES_SEED = [
  // Auction plates
  {
    id: "plate_001",
    code: "H",
    num: "3010",
    emirate: "Dubai",
    type: "gold",
    listingType: "auction",
    status: "active",
    price: 89000,
    startingBid: 30000,
    currentBid: 47500,
    minBidIncrement: 1500,
    bidCount: 12,
    auctionStartTime: daysAgo(5),
    auctionEndTime: daysFromNow(2),
    lotNumber: 8291,
    sellerId: "user_ahmed",
    sellerName: "Ahmed Al Rashid",
    sellerIsVerified: true,
    isVerified: true,
    views: 342,
    watchCount: 18,
  },
  {
    id: "plate_002",
    code: "R",
    num: "11001",
    emirate: "Dubai",
    type: "gold",
    listingType: "auction",
    status: "active",
    price: 179000,
    startingBid: 100000,
    currentBid: 165000,
    minBidIncrement: 5000,
    bidCount: 8,
    auctionStartTime: daysAgo(3),
    auctionEndTime: daysFromNow(5),
    lotNumber: 8292,
    reservePrice: 160000,
    sellerId: "user_ahmed",
    sellerName: "Ahmed Al Rashid",
    sellerIsVerified: true,
    isVerified: true,
    views: 589,
    watchCount: 34,
  },
  {
    id: "plate_003",
    code: "M",
    num: "555",
    emirate: "Dubai",
    type: "gold",
    listingType: "auction",
    status: "active",
    price: 500000,
    startingBid: 300000,
    currentBid: 320000,
    minBidIncrement: 10000,
    bidCount: 4,
    auctionStartTime: daysAgo(1),
    auctionEndTime: daysFromNow(1),
    lotNumber: 8293,
    sellerId: "user_salem",
    sellerName: "Salem Trading",
    sellerIsVerified: true,
    isVerified: true,
    views: 901,
    watchCount: 72,
  },
  {
    id: "plate_004",
    code: "7",
    num: "7777",
    emirate: "Abu Dhabi",
    type: "abudhabi",
    listingType: "auction",
    status: "active",
    price: 750000,
    startingBid: 500000,
    currentBid: 520000,
    minBidIncrement: 20000,
    bidCount: 3,
    auctionStartTime: daysAgo(2),
    auctionEndTime: daysFromNow(3),
    lotNumber: 8294,
    sellerId: "user_khalid",
    sellerName: "Khalid M.",
    sellerIsVerified: false,
    isVerified: false,
    views: 1204,
    watchCount: 101,
  },
  // Fixed price plates
  {
    id: "plate_005",
    code: "W",
    num: "20110",
    emirate: "Dubai",
    type: "silver",
    listingType: "fixed",
    status: "active",
    price: 27500,
    origPrice: 32000,
    sellerId: "user_salem",
    sellerName: "Salem Trading",
    sellerIsVerified: true,
    isVerified: true,
    views: 120,
    watchCount: 7,
  },
  {
    id: "plate_006",
    code: "R",
    num: "15154",
    emirate: "Dubai",
    type: "gold",
    listingType: "fixed",
    status: "active",
    price: 14900,
    sellerId: "user_khalid",
    sellerName: "Khalid M.",
    sellerIsVerified: false,
    isVerified: false,
    views: 56,
    watchCount: 2,
  },
  {
    id: "plate_007",
    code: "7",
    num: "88939",
    emirate: "Abu Dhabi",
    type: "abudhabi",
    listingType: "fixed",
    status: "active",
    price: 34500,
    sellerId: "user_hamad",
    sellerName: "Hamad Al Kaabi",
    sellerIsVerified: false,
    isVerified: false,
    views: 88,
    watchCount: 5,
  },
  {
    id: "plate_008",
    code: "3",
    num: "8798",
    emirate: "Sharjah",
    type: "sharjah",
    listingType: "fixed",
    status: "active",
    price: 20500,
    origPrice: 21500,
    sellerId: "user_fatima",
    sellerName: "Fatima Al Marri",
    sellerIsVerified: false,
    isVerified: false,
    views: 44,
    watchCount: 3,
  },
  {
    id: "plate_009",
    code: "A",
    num: "1",
    emirate: "Dubai",
    type: "gold",
    listingType: "fixed",
    status: "active",
    price: 9500000,
    sellerId: "user_salem",
    sellerName: "Salem Trading",
    sellerIsVerified: true,
    isVerified: true,
    views: 4832,
    watchCount: 389,
  },
  {
    id: "plate_010",
    code: "B",
    num: "12",
    emirate: "Dubai",
    type: "gold",
    listingType: "fixed",
    status: "active",
    price: 285000,
    sellerId: "user_ahmed",
    sellerName: "Ahmed Al Rashid",
    sellerIsVerified: true,
    isVerified: true,
    views: 210,
    watchCount: 15,
  },
  // 10 more plates
  {
    id: "plate_011",
    code: "P",
    num: "9",
    emirate: "Dubai",
    type: "gold",
    listingType: "auction",
    status: "active",
    price: 1200000,
    startingBid: 800000,
    currentBid: 920000,
    minBidIncrement: 20000,
    bidCount: 6,
    auctionStartTime: daysAgo(3),
    auctionEndTime: daysFromNow(1),
    lotNumber: 8295,
    sellerId: "user_faisal",
    sellerName: "Faisal Premium Plates",
    sellerIsVerified: true,
    isVerified: true,
    views: 2103,
    watchCount: 198,
  },
  {
    id: "plate_012",
    code: "5",
    num: "5555",
    emirate: "Abu Dhabi",
    type: "abudhabi",
    listingType: "auction",
    status: "active",
    price: 600000,
    startingBid: 400000,
    currentBid: 445000,
    minBidIncrement: 15000,
    bidCount: 3,
    auctionStartTime: daysAgo(1),
    auctionEndTime: daysFromNow(4),
    lotNumber: 8296,
    sellerId: "user_rania",
    sellerName: "Rania Investments",
    sellerIsVerified: true,
    isVerified: true,
    views: 876,
    watchCount: 64,
  },
  {
    id: "plate_013",
    code: "K",
    num: "1",
    emirate: "Dubai",
    type: "gold",
    listingType: "fixed",
    status: "active",
    price: 4500000,
    sellerId: "user_faisal",
    sellerName: "Faisal Premium Plates",
    sellerIsVerified: true,
    isVerified: true,
    views: 3210,
    watchCount: 280,
  },
  {
    id: "plate_014",
    code: "T",
    num: "786",
    emirate: "Dubai",
    type: "gold",
    listingType: "fixed",
    status: "active",
    price: 185000,
    origPrice: 210000,
    sellerId: "user_omar",
    sellerName: "Omar Al Mazrouei",
    sellerIsVerified: true,
    isVerified: true,
    views: 445,
    watchCount: 29,
  },
  {
    id: "plate_015",
    code: "9",
    num: "99999",
    emirate: "Sharjah",
    type: "sharjah",
    listingType: "fixed",
    status: "active",
    price: 42000,
    sellerId: "user_tariq",
    sellerName: "Tariq Al Suwaidi",
    sellerIsVerified: false,
    isVerified: false,
    views: 134,
    watchCount: 9,
  },
  {
    id: "plate_016",
    code: "L",
    num: "888",
    emirate: "Dubai",
    type: "gold",
    listingType: "fixed",
    status: "active",
    price: 320000,
    sellerId: "user_omar",
    sellerName: "Omar Al Mazrouei",
    sellerIsVerified: true,
    isVerified: true,
    views: 721,
    watchCount: 55,
  },
  {
    id: "plate_017",
    code: "2",
    num: "22",
    emirate: "Abu Dhabi",
    type: "abudhabi",
    listingType: "fixed",
    status: "active",
    price: 890000,
    sellerId: "user_rania",
    sellerName: "Rania Investments",
    sellerIsVerified: true,
    isVerified: true,
    views: 1543,
    watchCount: 112,
  },
  {
    id: "plate_018",
    code: "6",
    num: "6006",
    emirate: "Ajman",
    type: "ajman",
    listingType: "fixed",
    status: "active",
    price: 18500,
    sellerId: "user_noura",
    sellerName: "Noura Al Zaabi",
    sellerIsVerified: false,
    isVerified: false,
    views: 67,
    watchCount: 4,
  },
  {
    id: "plate_019",
    code: "N",
    num: "500",
    emirate: "Dubai",
    type: "gold",
    listingType: "fixed",
    status: "active",
    price: 95000,
    origPrice: 110000,
    sellerId: "user_faisal",
    sellerName: "Faisal Premium Plates",
    sellerIsVerified: true,
    isVerified: true,
    views: 388,
    watchCount: 31,
  },
  {
    id: "plate_020",
    code: "Q",
    num: "100",
    emirate: "Dubai",
    type: "gold",
    listingType: "fixed",
    status: "active",
    price: 67000,
    sellerId: "user_khalid",
    sellerName: "Khalid M.",
    sellerIsVerified: false,
    isVerified: false,
    views: 198,
    watchCount: 13,
  },
];

// ─── Seed Bids ────────────────────────────────────────────────────────────────

const BIDS_SEED = [
  // plate_001 bids
  {
    id: "bid_001",
    plateId: "plate_001",
    bidderId: "user_hamad",
    bidderName: "Hamad Al Kaabi",
    amount: 30000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(4),
  },
  {
    id: "bid_002",
    plateId: "plate_001",
    bidderId: "user_fatima",
    bidderName: "Fatima Al Marri",
    amount: 32000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(3),
  },
  {
    id: "bid_003",
    plateId: "plate_001",
    bidderId: "user_hamad",
    bidderName: "Hamad Al Kaabi",
    amount: 35000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(2),
  },
  {
    id: "bid_004",
    plateId: "plate_001",
    bidderId: "user_khalid",
    bidderName: "Khalid M.",
    amount: 47500,
    isWinning: true,
    isOutbid: false,
    createdAt: daysAgo(1),
  },
  // plate_002 bids
  {
    id: "bid_005",
    plateId: "plate_002",
    bidderId: "user_hamad",
    bidderName: "Hamad Al Kaabi",
    amount: 110000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(2),
  },
  {
    id: "bid_006",
    plateId: "plate_002",
    bidderId: "user_fatima",
    bidderName: "Fatima Al Marri",
    amount: 130000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(2),
  },
  {
    id: "bid_007",
    plateId: "plate_002",
    bidderId: "user_khalid",
    bidderName: "Khalid M.",
    amount: 165000,
    isWinning: true,
    isOutbid: false,
    createdAt: daysAgo(1),
  },
  // plate_003 bids
  {
    id: "bid_008",
    plateId: "plate_003",
    bidderId: "user_hamad",
    bidderName: "Hamad Al Kaabi",
    amount: 300000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(1),
  },
  {
    id: "bid_009",
    plateId: "plate_003",
    bidderId: "user_fatima",
    bidderName: "Fatima Al Marri",
    amount: 310000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(1),
  },
  {
    id: "bid_010",
    plateId: "plate_003",
    bidderId: "user_khalid",
    bidderName: "Khalid M.",
    amount: 320000,
    isWinning: true,
    isOutbid: false,
    createdAt: daysAgo(0),
  },
  // plate_004 bids
  {
    id: "bid_011",
    plateId: "plate_004",
    bidderId: "user_tariq",
    bidderName: "Tariq Al Suwaidi",
    amount: 500000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(2),
  },
  {
    id: "bid_012",
    plateId: "plate_004",
    bidderId: "user_noura",
    bidderName: "Noura Al Zaabi",
    amount: 510000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(1),
  },
  {
    id: "bid_013",
    plateId: "plate_004",
    bidderId: "user_omar",
    bidderName: "Omar Al Mazrouei",
    amount: 520000,
    isWinning: true,
    isOutbid: false,
    createdAt: daysAgo(0),
  },
  // plate_011 bids
  {
    id: "bid_014",
    plateId: "plate_011",
    bidderId: "user_ahmed",
    bidderName: "Ahmed Al Rashid",
    amount: 800000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(3),
  },
  {
    id: "bid_015",
    plateId: "plate_011",
    bidderId: "user_rania",
    bidderName: "Rania Investments",
    amount: 840000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(2),
  },
  {
    id: "bid_016",
    plateId: "plate_011",
    bidderId: "user_hamad",
    bidderName: "Hamad Al Kaabi",
    amount: 880000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(2),
  },
  {
    id: "bid_017",
    plateId: "plate_011",
    bidderId: "user_ahmed",
    bidderName: "Ahmed Al Rashid",
    amount: 900000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(1),
  },
  {
    id: "bid_018",
    plateId: "plate_011",
    bidderId: "user_khalid",
    bidderName: "Khalid M.",
    amount: 920000,
    isWinning: true,
    isOutbid: false,
    createdAt: daysAgo(0),
  },
  // plate_012 bids
  {
    id: "bid_019",
    plateId: "plate_012",
    bidderId: "user_fatima",
    bidderName: "Fatima Al Marri",
    amount: 400000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(1),
  },
  {
    id: "bid_020",
    plateId: "plate_012",
    bidderId: "user_tariq",
    bidderName: "Tariq Al Suwaidi",
    amount: 415000,
    isWinning: false,
    isOutbid: true,
    createdAt: daysAgo(1),
  },
  {
    id: "bid_021",
    plateId: "plate_012",
    bidderId: "user_noura",
    bidderName: "Noura Al Zaabi",
    amount: 445000,
    isWinning: true,
    isOutbid: false,
    createdAt: daysAgo(0),
  },
];

// ─── Seed Transactions ────────────────────────────────────────────────────────

const TRANSACTIONS_SEED = [
  {
    id: "tx_001",
    plateId: "plate_009",
    sellerId: "user_salem",
    buyerId: "user_hamad",
    amount: 9500000,
    escrowFee: 190000,
    type: "fixed_purchase",
    status: "completed",
    escrowReleasedAt: daysAgo(10),
    createdAt: daysAgo(15),
    updatedAt: daysAgo(10),
  },
  {
    id: "tx_002",
    plateId: "plate_005",
    sellerId: "user_salem",
    buyerId: "user_fatima",
    amount: 27500,
    escrowFee: 550,
    type: "fixed_purchase",
    status: "escrow_held",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: "tx_003",
    plateId: "plate_001",
    sellerId: "user_ahmed",
    buyerId: "user_khalid",
    amount: 47500,
    escrowFee: 950,
    type: "auction_won",
    status: "pending",
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
  },
];

// ─── Seed Gifts ───────────────────────────────────────────────────────────────

const GIFTS_SEED = [
  {
    id: "gift_001",
    plateId: "plate_008",
    senderId: "user_fatima",
    recipientEmail: "friend@example.com",
    message: "Happy Birthday! This plate is yours.",
    code: "SAKK-GFT1",
    status: "sent",
    expiresAt: daysFromNow(30),
    createdAt: daysAgo(1),
  },
  {
    id: "gift_002",
    plateId: "plate_006",
    senderId: "user_khalid",
    recipientPhone: "+971501234567",
    message: "A gift for you.",
    code: "SAKK-GFT2",
    status: "pending",
    expiresAt: daysFromNow(14),
    createdAt: daysAgo(0),
  },
];

// ─── Seed Watchlist ────────────────────────────────────────────────────────────

const WATCHLIST_SEED = [
  {
    id: "watch_001",
    userId: "user_hamad",
    plateId: "plate_001",
    plateCode: "H",
    plateNum: "3010",
    createdAt: daysAgo(3),
  },
  {
    id: "watch_002",
    userId: "user_hamad",
    plateId: "plate_002",
    plateCode: "R",
    plateNum: "11001",
    createdAt: daysAgo(2),
  },
  {
    id: "watch_003",
    userId: "user_fatima",
    plateId: "plate_003",
    plateCode: "M",
    plateNum: "555",
    createdAt: daysAgo(1),
  },
  {
    id: "watch_004",
    userId: "user_khalid",
    plateId: "plate_009",
    plateCode: "A",
    plateNum: "1",
    createdAt: daysAgo(5),
  },
  {
    id: "watch_005",
    userId: "user_omar",
    plateId: "plate_011",
    plateCode: "P",
    plateNum: "9",
    createdAt: daysAgo(2),
  },
  {
    id: "watch_006",
    userId: "user_rania",
    plateId: "plate_013",
    plateCode: "K",
    plateNum: "1",
    createdAt: daysAgo(3),
  },
  {
    id: "watch_007",
    userId: "user_tariq",
    plateId: "plate_012",
    plateCode: "5",
    plateNum: "5555",
    createdAt: daysAgo(1),
  },
  {
    id: "watch_008",
    userId: "user_faisal",
    plateId: "plate_004",
    plateCode: "7",
    plateNum: "7777",
    createdAt: daysAgo(4),
  },
  {
    id: "watch_009",
    userId: "user_noura",
    plateId: "plate_016",
    plateCode: "L",
    plateNum: "888",
    createdAt: daysAgo(1),
  },
  {
    id: "watch_010",
    userId: "user_hamad",
    plateId: "plate_017",
    plateCode: "2",
    plateNum: "22",
    createdAt: daysAgo(2),
  },
];

// ─── Seed Notifications ────────────────────────────────────────────────────────

const NOTIFICATIONS_SEED = [
  {
    id: "notif_001",
    userId: "user_hamad",
    type: "outbid",
    title: "You've been outbid",
    body: "Khalid M. placed a higher bid on plate H 3010",
    plateId: "plate_001",
    read: false,
    createdAt: daysAgo(1),
  },
  {
    id: "notif_002",
    userId: "user_fatima",
    type: "auction_ending",
    title: "Auction ending soon",
    body: "Plate M 555 auction ends in 24 hours",
    plateId: "plate_003",
    read: false,
    createdAt: daysAgo(0),
  },
  {
    id: "notif_003",
    userId: "user_khalid",
    type: "auction_won",
    title: "You won the auction!",
    body: "Congratulations! You won plate H 3010 for AED 47,500",
    plateId: "plate_001",
    read: false,
    createdAt: daysAgo(0),
  },
  {
    id: "notif_004",
    userId: "user_omar",
    type: "outbid",
    title: "You've been outbid",
    body: "Khalid M. placed a higher bid on plate P 9",
    plateId: "plate_011",
    read: false,
    createdAt: daysAgo(0),
  },
  {
    id: "notif_005",
    userId: "user_rania",
    type: "auction_ending",
    title: "Auction ending soon",
    body: "Plate 5 5555 auction ends in 4 days — you're watching it",
    plateId: "plate_012",
    read: true,
    createdAt: daysAgo(1),
  },
  {
    id: "notif_006",
    userId: "user_hamad",
    type: "outbid",
    title: "You've been outbid",
    body: "Omar Al Mazrouei placed a higher bid on plate 7 7777",
    plateId: "plate_004",
    read: false,
    createdAt: daysAgo(0),
  },
  {
    id: "notif_007",
    userId: "user_fatima",
    type: "outbid",
    title: "You've been outbid",
    body: "Tariq Al Suwaidi placed a higher bid on plate 5 5555",
    plateId: "plate_012",
    read: false,
    createdAt: daysAgo(1),
  },
  {
    id: "notif_008",
    userId: "user_ahmed",
    type: "new_bid",
    title: "New bid on your listing",
    body: "Someone placed AED 900,000 on your plate P 9",
    plateId: "plate_011",
    read: true,
    createdAt: daysAgo(1),
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seedCollection(
  collectionName: string,
  items: Record<string, unknown>[],
) {
  console.log(`\nSeeding ${collectionName}...`);
  for (const item of items) {
    const { id, ...data } = item;
    const ref = doc(collection(db, collectionName), id as string);
    // Add timestamps if missing
    if (!data.createdAt) data.createdAt = now();
    if (!data.updatedAt) data.updatedAt = now();
    await setDoc(ref, data, { merge: true });
    console.log(`  ✓ ${collectionName}/${id}`);
  }
}

async function createAuthUsers() {
  console.log("\nCreating Auth users...");
  for (const user of DEMO_USERS) {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        user.email,
        DEMO_PASSWORD,
      );
      await updateProfile(cred.user, { displayName: user.displayName });
      // Write user profile doc using Auth UID
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        displayName: user.displayName,
        email: user.email,
        emirate: user.emirate,
        isVerified: user.isVerified,
        isTrustedSeller: user.isTrustedSeller,
        totalSales: user.totalSales,
        totalPurchases: user.totalPurchases,
        rating: user.rating,
        reviewCount: user.reviewCount,
        walletBalance: user.walletBalance,
        createdAt: now(),
        updatedAt: now(),
      });
      console.log(
        `  ✓ Created Auth user: ${user.email} (uid: ${cred.user.uid})`,
      );
    } catch (err: unknown) {
      const firebaseError = err as { code: string; message: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        console.log(`  ~ Skipped (already exists): ${user.email}`);
      } else {
        console.error(`  ✗ Failed for ${user.email}:`, firebaseError.message);
      }
    }
  }
}

async function main() {
  console.log("🌱 Sakk Firebase Seed Script");
  console.log("================================");

  // Note: Auth user creation is optional — comment out if using fixed UIDs
  // For demo purposes, the plate/bid/etc seed data uses string IDs like "user_ahmed"
  // In production, replace with real Auth UIDs
  await createAuthUsers();

  await seedCollection("plates", PLATES_SEED as Record<string, unknown>[]);
  await seedCollection("bids", BIDS_SEED as Record<string, unknown>[]);
  await seedCollection(
    "transactions",
    TRANSACTIONS_SEED as Record<string, unknown>[],
  );
  await seedCollection("gifts", GIFTS_SEED as Record<string, unknown>[]);
  await seedCollection(
    "watchlist",
    WATCHLIST_SEED as Record<string, unknown>[],
  );
  await seedCollection(
    "notifications",
    NOTIFICATIONS_SEED as Record<string, unknown>[],
  );

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
