import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, token = "USDC") {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value)} ${token}`;
}

export function formatDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(d);
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}
