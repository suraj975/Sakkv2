// Re-export shared UI types from the canonical source
export type { PlateType, PlateSize } from "./firebase";

// Legacy mock-data types used only by lib/plates.ts seed data
export interface Bid {
  bidderInitials: string;
  bidderAlias: string;
  amount: number;
  time: string;
  isLeading?: boolean;
}

export interface Plate {
  id: number;
  code: string;
  num: string;
  price: number;
  orig?: number;
  emirate: string;
  type: import("./firebase").PlateType;
  verified: boolean;
  seller: string;
  days: number;
  listingType?: "fixed" | "auction";
  auctionEndTime?: string;
  currentBid?: number;
  bidCount?: number;
  minBidIncrement?: number;
  lotNumber?: number;
}
