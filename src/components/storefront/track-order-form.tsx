"use client";

import { useState } from "react";
import { Search, Loader2, Package } from "lucide-react";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/utils";

export function TrackOrderForm() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          className="input"
          placeholder="رقم الطلب (SS-2025-0001) أو رقم الجوال"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary flex-shrink-0">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          بحث
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {searched && !loading && orders.length === 0 && (
          <div className="card p-8 text-center text-oud-400">
            <Package className="mx-auto mb-3 h-12 w-12" />
            <p>لا توجد طلبات مطابقة</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-oud-900">{order.orderNumber}</span>
                <span className="mr-2 text-xs text-oud-500">{formatDate(order.createdAt)}</span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_STYLES[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-oud-600">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} ×{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-oud-100 pt-1 flex justify-between font-bold">
                <span>الإجمالي</span>
                <span className="text-gold-700">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
