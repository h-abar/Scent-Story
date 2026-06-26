"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/utils";
import type { SerializedOrder } from "@/lib/serialize";
import { ChevronLeft, Search, Filter } from "lucide-react";

interface AdminOrdersListProps {
  initialOrders: SerializedOrder[];
}

const STATUS_FILTERS = [
  { value: "", label: "الكل" },
  { value: "new", label: "جديد" },
  { value: "awaiting_transfer", label: "بانتظار التحويل" },
  { value: "receipt_uploaded", label: "تم رفع الإيصال" },
  { value: "under_review", label: "قيد المراجعة" },
  { value: "payment_confirmed", label: "تم تأكيد الدفع" },
  { value: "preparing", label: "قيد التجهيز" },
  { value: "shipped", label: "تم الشحن" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

export function AdminOrdersList({ initialOrders }: AdminOrdersListProps) {
  const [orders, setOrders] = useState<SerializedOrder[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchOrders(newPage = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("q", search);
      params.set("page", String(newPage));
      const res = await fetch(`/admin/api/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setPage(data.page);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(value: string) {
    setStatusFilter(value);
    fetchOrders(1);
  }

  return (
    <div>
      {/* أدوات التصفية */}
      <div className="flex flex-wrap items-center gap-3 border-b border-cream-300 p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-oud-400" />
          <input
            type="text"
            placeholder="بحث برقم الطلب أو الجوال..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOrders(1)}
            className="input pr-9 text-sm"
            style={{ width: "240px" }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-oud-400" />
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="input text-sm"
            style={{ width: "auto" }}
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-right text-xs text-oud-500">
            <tr>
              <th className="px-4 py-3 font-medium">رقم الطلب</th>
              <th className="px-4 py-3 font-medium">العميل</th>
              <th className="px-4 py-3 font-medium">الجوال</th>
              <th className="px-4 py-3 font-medium">المبلغ</th>
              <th className="px-4 py-3 font-medium">الدفع</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium">التاريخ</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-oud-400">
                  لا توجد طلبات
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50/50">
                  <td className="px-4 py-3 font-medium text-brand-brown-dark">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-oud-700">{order.customerName}</td>
                  <td className="px-4 py-3 text-oud-600" dir="ltr">{order.phone}</td>
                  <td className="px-4 py-3 font-medium text-brand-gold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-oud-500">
                      {order.paymentMethod === "receipt_upload" ? "إيصال" : "واتساب"}
                    </span>
                    {order.payment?.receiptUrl && (
                      <span className="mr-1 text-xs text-blue-500">📎</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_STYLES[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-oud-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center gap-1 text-xs font-medium text-brand-gold hover:text-brand-brown"
                    >
                      تفاصيل
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* الترقيم */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-cream-300 p-4">
          <button
            onClick={() => fetchOrders(page - 1)}
            disabled={page <= 1 || loading}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40"
          >
            السابق
          </button>
          <span className="text-sm text-oud-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => fetchOrders(page + 1)}
            disabled={page >= totalPages || loading}
            className="btn-outline px-3 py-1.5 text-xs disabled:opacity-40"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
