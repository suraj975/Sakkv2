export type PlateType = "gold" | "silver" | "abudhabi" | "sharjah";
export type PlateSize = "sm" | "md" | "lg";

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
  type: PlateType;
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
