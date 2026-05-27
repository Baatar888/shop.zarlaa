import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Хямдралын хувийг тооцоолно
 * calcDiscount(150000, 82500) => 45
 */
export function calcDiscount(
  originalPrice: number,
  salePrice: number
): number {
  if (!originalPrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Монгол төгрөгөөр форматлана
 * formatPrice(82500) => "₮82,500"
 */
export function formatPrice(amount: number): string {
  return "₮" + amount.toLocaleString("mn-MN");
}

/**
 * Хадгалсан мөнгийг тооцоолно
 */
export function calcSavings(
  originalPrice: number,
  salePrice: number
): number {
  return Math.max(0, originalPrice - salePrice);
}
