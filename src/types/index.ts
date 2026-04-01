export type PlateType = "gold" | "silver" | "abudhabi" | "sharjah";
export type PlateSize = "sm" | "md" | "lg";

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
}
