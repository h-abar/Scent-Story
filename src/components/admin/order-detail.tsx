"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Check, X, MessageCircle, Printer, FileText, Image as ImageIcon,
  Loader2, Truck, Store, Copy, ChevronRight,
} from "lucide-react";
import {
  formatPrice, formatDate, copyToClipboard,
  ORDER_STATUS_LABELS, ORDER_STATUS_STYLES,
} from "@/lib/utils";
import type { SerializedOrder } from "@/lib/serialize";

const STATUS_OPTIONS = [
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

export function OrderDetail({ order: initialOrder }: { order: SerializedOrder }) {
  const router = useRouter();
  const [order, setOrder] = useState<SerializedOrder>(initialOrder);
  const [updating, setUpdating] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [copied, setCopied] = useState(false);

  async function updateStatus(status: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/admin/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  }

  async function updatePayment(paymentStatus: "approved" | "rejected", rejectionReason?: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/admin/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus,
          status: paymentStatus === "approved" ? "payment_confirmed" : order.status,
          ...(rejectionReason ? { rejectionReason } : {}),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  }

  function sendWhatsApp() {
    const message = encodeURIComponent(
      `السلام عليكم ${order.customerName}\n\nبخصوص طلبك رقم ${order.orderNumber}:\nالحالة: ${ORDER_STATUS_LABELS[order.status] ?? order.status}\n\nحكاية طيب`
    );
    const phone = order.phone.replace(/^0/, "966").replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  }

  function handlePrint() {
    window.print();
  }

  async function handleCopyPhone() {
    const ok = await copyToClipboard(order.phone);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const isReceipt = order.paymentMethod === "receipt_upload";
  const receiptUrl = order.payment?.receiptUrl;
  const isPdf = receiptUrl?.endsWith(".pdf");

  return (
    <div>
      {/* رأس الصفحة - لا يُطبع */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-oud-500">
            <a href="/admin/orders" className="hover:text-gold-600">الطلبات</a>
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span className="text-oud-800">{order.orderNumber}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-oud-900">تفاصيل الطلب</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={sendWhatsApp} className="btn bg-green-600 text-white hover:bg-green-700">
            <MessageCircle className="h-4 w-4" />
            رسالة واتساب
          </button>
          <button onClick={handlePrint} className="btn-outline">
            <Printer className="h-4 w-4" />
            طباعة الفاتورة
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* العمود الرئيسي - يُطبع */}
        <div className="lg:col-span-2 space-y-6">
          {/* الفاتورة - منطقة الطباعة */}
          <div className="print-area card p-6">
            <div className="mb-6 flex items-center justify-between border-b border-oud-100 pb-4">
              <div>
                <h2 className="font-display text-xl text-gold-600">حكاية طيب</h2>
                <p className="text-xs text-oud-500">فاتورة الطلب</p>
              </div>
              <div className="text-left">
                <div className="font-bold text-oud-900">{order.orderNumber}</div>
                <div className="text-xs text-oud-500">{formatDate(order.createdAt)}</div>
              </div>
            </div>

            {/* بيانات العميل */}
            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="mb-2 font-semibold text-oud-700">بيانات العميل</h3>
                <div className="space-y-1 text-oud-600">
                  <div>الاسم: {order.customerName}</div>
                  <div>الجوال: <span dir="ltr">{order.phone}</span></div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-oud-700">طريقة الاستلام</h3>
                <div className="space-y-1 text-oud-600">
                  <div className="flex items-center gap-1.5">
                    {order.fulfillment === "shipping" ? <Truck className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                    {order.fulfillment === "shipping" ? "شحن" : "استلام من الفرع"}
                  </div>
                  {order.fulfillment === "shipping" ? (
                    <div>{order.city} - {order.address}</div>
                  ) : (
                    <div>{order.branch?.name}</div>
                  )}
                </div>
              </div>
            </div>

            {/* العناصر */}
            <table className="mb-4 w-full text-sm">
              <thead className="border-b border-oud-100 text-right text-xs text-oud-500">
                <tr>
                  <th className="py-2 font-medium">المنتج</th>
                  <th className="py-2 font-medium">السعر</th>
                  <th className="py-2 font-medium">الكمية</th>
                  <th className="py-2 font-medium">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oud-50">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 text-oud-800">{item.name}</td>
                    <td className="py-2.5 text-oud-600">{formatPrice(item.price)}</td>
                    <td className="py-2.5 text-oud-600">{item.quantity}</td>
                    <td className="py-2.5 font-medium text-oud-900">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* الإجماليات */}
            <div className="mb-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-oud-600">المجموع الفرعي</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-oud-600">الشحن</span>
                <span className="font-medium">
                  {Number(order.shippingFee) > 0 ? formatPrice(order.shippingFee) : "مجاني"}
                </span>
              </div>
              <div className="flex justify-between border-t border-oud-100 pt-2 text-base font-bold">
                <span className="text-oud-900">الإجمالي</span>
                <span className="text-gold-700">{formatPrice(order.total)}</span>
              </div>
            </div>

            {order.notes && (
              <div className="rounded-lg bg-oud-50 p-3 text-sm text-oud-600">
                <span className="font-semibold">ملاحظات: </span>{order.notes}
              </div>
            )}

            <div className="mt-6 border-t border-oud-100 pt-4 text-center text-xs text-oud-400">
              شكراً لتسوقكم من حكاية طيب — للاستفسار: واتساب {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}
            </div>
          </div>

          {/* الإيصال - لا يُطبع */}
          {isReceipt && receiptUrl && (
            <div className="no-print card p-6">
              <h2 className="mb-4 text-lg font-bold text-oud-900">إيصال التحويل</h2>
              <button
                onClick={() => setShowReceiptModal(true)}
                className="flex items-center gap-3 rounded-xl border border-oud-100 bg-oud-50 p-4 text-right transition-colors hover:border-gold-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                  {isPdf ? <FileText className="h-6 w-6 text-red-500" /> : <ImageIcon className="h-6 w-6 text-blue-500" />}
                </div>
                <div>
                  <div className="font-medium text-oud-900">عرض الإيصال</div>
                  <div className="text-xs text-oud-500">اضغط للتكبير</div>
                </div>
              </button>

              {/* بيانات التحويل */}
              {order.payment && (
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {order.payment.accountHolderName && (
                    <div>
                      <span className="text-oud-500">اسم صاحب الحساب: </span>
                      <span className="font-medium text-oud-800">{order.payment.accountHolderName}</span>
                    </div>
                  )}
                  {order.payment.transferDate && (
                    <div>
                      <span className="text-oud-500">تاريخ التحويل: </span>
                      <span className="font-medium text-oud-800">{formatDate(order.payment.transferDate)}</span>
                    </div>
                  )}
                  {order.payment.last4 && (
                    <div>
                      <span className="text-oud-500">آخر 4 أرقام: </span>
                      <span className="font-medium text-oud-800" dir="ltr">{order.payment.last4}</span>
                    </div>
                  )}
                </div>
              )}

              {/* أزرار قبول/رفض */}
              {order.payment && order.payment.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => updatePayment("approved")}
                    disabled={updating}
                    className="btn bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    قبول التحويل
                  </button>
                  <button
                    onClick={() => updatePayment("rejected", "لم يتم التحقق من التحويل")}
                    disabled={updating}
                    className="btn bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                    رفض التحويل
                  </button>
                </div>
              )}

              {order.payment && order.payment.status !== "pending" && (
                <div className="mt-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    order.payment.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {order.payment.status === "approved" ? "تم القبول" : "تم الرفض"}
                    {order.payment.verifiedAt && ` — ${formatDate(order.payment.verifiedAt)}`}
                  </span>
                  {order.payment.rejectionReason && (
                    <p className="mt-2 text-sm text-red-600">سبب الرفض: {order.payment.rejectionReason}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* الشريط الجانبي - لا يُطبع */}
        <div className="no-print space-y-4">
          {/* حالة الطلب */}
          <div className="card p-5">
            <h3 className="mb-3 font-bold text-oud-900">حالة الطلب</h3>
            <div className="mb-4">
              <span className={`inline-block rounded-full px-3 py-1.5 text-sm font-medium ${ORDER_STATUS_STYLES[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>
            <label className="label">تغيير الحالة</label>
            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updating}
              className="input text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {updating && (
              <div className="mt-2 flex items-center gap-2 text-xs text-oud-400">
                <Loader2 className="h-3 w-3 animate-spin" /> جاري التحديث...
              </div>
            )}
          </div>

          {/* معلومات العميل */}
          <div className="card p-5">
            <h3 className="mb-3 font-bold text-oud-900">معلومات العميل</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-oud-500">الاسم: </span>
                <span className="font-medium text-oud-800">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-oud-500">الجوال: </span>
                  <span className="font-medium text-oud-800" dir="ltr">{order.phone}</span>
                </div>
                <button onClick={handleCopyPhone} className="text-gold-600 hover:text-gold-700">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={sendWhatsApp}
                className="btn bg-green-600 text-white hover:bg-green-700 w-full mt-3 text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                مراسلة عبر واتساب
              </button>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div className="card p-5">
            <h3 className="mb-3 font-bold text-oud-900">طريقة الدفع</h3>
            <div className="text-sm text-oud-600">
              {order.paymentMethod === "receipt_upload" ? "تحويل بنكي + إيصال" : "واتساب"}
            </div>
            {order.payment && (
              <div className="mt-2 text-sm">
                <span className="text-oud-500">حالة الدفع: </span>
                <span className={`font-medium ${
                  order.payment.status === "approved" ? "text-emerald-600" :
                  order.payment.status === "rejected" ? "text-red-600" : "text-amber-600"
                }`}>
                  {order.payment.status === "approved" ? "مقبول" :
                   order.payment.status === "rejected" ? "مرفوض" : "بانتظار المراجعة"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* نافذة تكبير الإيصال */}
      {showReceiptModal && receiptUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowReceiptModal(false)}
        >
          <div className="relative max-h-full max-w-4xl overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute left-2 top-2 z-10 rounded-lg bg-white/90 p-2 text-oud-700 hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
            {isPdf ? (
              <iframe src={receiptUrl} className="h-[90vh] w-full rounded-lg bg-white" title="إيصال" />
            ) : (
              <img src={receiptUrl} alt="إيصال التحويل" className="max-h-[90vh] rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
