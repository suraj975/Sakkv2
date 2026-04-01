import type { Plate } from "@/types";

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
    seller: "Golden Plates UAE",
    days: 1,
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
