import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** دمج أصناف Tailwind بأمان */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** تنسيق السعر بالريال السعودي */
export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("ar-SA", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num) + " ر.س";
}

/** تنسيق التاريخ بالعربية */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** نسخ نص إلى الحافظة (للعميل) */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** توليد رقم طلب بصيغة SS-YYYY-NNNN */
export function generateOrderNumber(seq: number): string {
  const year = new Date().getFullYear();
  return `SS-${year}-${String(seq).padStart(4, "0")}`;
}

/** ترجمة حالات الطلب للعربية */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  awaiting_transfer: "بانتظار التحويل",
  receipt_uploaded: "تم رفع الإيصال",
  under_review: "قيد المراجعة",
  payment_confirmed: "تم تأكيد الدفع",
  preparing: "قيد التجهيز",
  shipped: "تم الشحن",
  completed: "مكتمل",
  cancelled: "ملغي",
};

/** ألوان شارة الحالة */
export const ORDER_STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  awaiting_transfer: "bg-amber-100 text-amber-800",
  receipt_uploaded: "bg-purple-100 text-purple-800",
  under_review: "bg-orange-100 text-orange-800",
  payment_confirmed: "bg-emerald-100 text-emerald-800",
  preparing: "bg-cyan-100 text-cyan-800",
  shipped: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
