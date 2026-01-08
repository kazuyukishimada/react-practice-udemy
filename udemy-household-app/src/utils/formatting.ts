import { format } from "date-fns";

export function formatmonth(date: Date): string {
  return format(date, "yyyy-MM");
}

// 日本円に変換する
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ja-JP");
}