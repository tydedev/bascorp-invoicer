import { InvoiceItem } from "@/types/invoice";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTotals = (items: InvoiceItem[], taxPercent: number) => {
  const subTotal = items.reduce((sum, item) => sum + (item.total ?? 0), 0);

  const taxAmount = (subTotal * taxPercent) / 100;
  const total = subTotal + taxAmount;

  return { subTotal, taxAmount, total };
};
