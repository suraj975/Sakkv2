import { Timestamp } from "firebase/firestore";

export type Emirate =
  | "Dubai"
  | "Abu Dhabi"
  | "Sharjah"
  | "Ajman"
  | "RAK"
  | "Fujairah"
  | "UAQ";

/** Shared UI utility types (consolidated from legacy types/index.ts) */
export type PlateSize = "sm" | "md" | "lg";

export type PlateTypeFS = "gold" | "silver" | "abudhabi" | "sharjah";
/** Alias kept for component compatibility */
export type PlateType = PlateTypeFS;
export type ListingType = "fixed" | "auction";
export type PlateStatus =
  | "active"
  | "sold"
  | "expired"
  | "cancelled"
  | "in_escrow";
export type TransactionType = "fixed_purchase" | "auction_won" | "gift_redeem";
export type TransactionStatus =
  | "pending"
  | "escrow_held"
  | "completed"
  | "disputed"
  | "refunded";
export type GiftStatus = "pending" | "sent" | "redeemed" | "expired";
export type NotificationType =
  | "outbid"
  | "auction_ending"
  | "auction_won"
  | "price_drop"
  | "sale_complete"
  | "gift_received";

export interface FSUser {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  emirate?: Emirate;
  isVerified: boolean;
  isTrustedSeller: boolean;
  totalSales: number;
  totalPurchases: number;
  rating: number;
  reviewCount: number;
  walletBalance: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FSPlate {
  id?: string; // Firestore doc ID (not stored in doc body)
  code: string;
  num: string;
  emirate: Emirate;
  type: PlateTypeFS;
  listingType: ListingType;
  status: PlateStatus;

  // Fixed price
  price: number;
  origPrice?: number;

  // Auction
  startingBid?: number;
  currentBid?: number;
  minBidIncrement?: number;
  bidCount?: number;
  auctionStartTime?: Timestamp;
  auctionEndTime?: Timestamp;
  lotNumber?: number;
  reservePrice?: number;

  // Seller (denorm'd)
  sellerId: string;
  sellerName: string;
  sellerIsVerified: boolean;

  buyerId?: string;

  isVerified: boolean;
  views: number;
  watchCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FSBid {
  id?: string;
  plateId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  isWinning: boolean;
  isOutbid: boolean;
  autoBidMax?: number;
  createdAt: Timestamp;
}

export interface FSWatchlistItem {
  id?: string;
  userId: string;
  plateId: string;
  plateCode: string;
  plateNum: string;
  createdAt: Timestamp;
}

export interface FSTransaction {
  id?: string;
  plateId: string;
  sellerId: string;
  buyerId: string;
  amount: number;
  escrowFee: number;
  type: TransactionType;
  status: TransactionStatus;
  escrowReleasedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FSGift {
  id?: string;
  plateId: string;
  senderId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  code: string;
  status: GiftStatus;
  expiresAt: Timestamp;
  redeemedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface FSNotification {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  plateId?: string;
  read: boolean;
  createdAt: Timestamp;
}
