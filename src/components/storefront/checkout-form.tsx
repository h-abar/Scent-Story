"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Upload, FileText, MessageCircle, Truck, Store, Loader2, CreditCard, Lock, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCart } from "./cart-provider";
import { formatPrice, copyToClipboard } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  address: string | null;
}

interface BankAccount {
  bankName: string;
  iban: string;
  holder: string;
}

interface CheckoutFormProps {
  branches: Branch[];
  shippingFee: number;
  freeShippingThreshold: number;
  whatsappNumber: string;
  bankAccounts: BankAccount[];
}

type FulfillmentType = "shipping" | "pickup";
type PaymentMethod = "receipt_upload" | "whatsapp";

export function CheckoutForm({
  branches,
  shippingFee,
  freeShippingThreshold,
  whatsappNumber,
  bankAccounts,
}: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fulfillment, setFulfillment] = useState<FulfillmentType>("shipping");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("receipt_upload");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [copiedIban, setCopiedIban] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // بيانات العميل
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // بيانات التحويل
  const [accountHolderName, setAccountHolderName] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [last4, setLast4] = useState("");

  const qualifiesFreeShipping =
    freeShippingThreshold > 0 && subtotal >= freeShippingThreshold;
  const actualShippingFee = fulfillment === "shipping" && !qualifiesFreeShipping ? shippingFee : 0;
  const total = subtotal + actualShippingFee;

  async function handleCopyIban(iban: string) {
    const ok = await copyToClipboard(iban);
    if (ok) {
      setCopiedIban(iban);
      setTimeout(() => setCopiedIban(""), 2000);
    }
  }

  function buildWhatsAppMessage(): string {
    const lines = [
      "السلام عليكم",
      "",
      "أرغب في طلب المنتجات التالية:",
      "",
      ...items.map((i) => `- ${i.name} ×${i.quantity}`),
      "",
      `الإجمالي:`,
      `${formatPrice(total)}`,
      "",
      `الاسم:`,
      customerName,
      "",
      `الجوال:`,
      phone,
      "",
      `العنوان:`,
      fulfillment === "shipping" ? `${city} - ${address}` : `استلام من الفرع`,
      "",
      "بانتظار تأكيد الطلب.",
    ];
    return lines.join("\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("السلة فارغة");
      return;
    }
    if (!customerName || !phone) {
      setError("يرجى إدخال الاسم ورقم الجوال");
      return;
    }
    if (fulfillment === "shipping" && (!city || !address)) {
      setError("يرجى إدخال المدينة والعنوان");
      return;
    }
    if (fulfillment === "pickup" && !selectedBranch) {
      setError("يرجى اختيار الفرع");
      return;
    }
    if (paymentMethod === "receipt_upload" && !receiptFile) {
      setError("يرجى رفع صورة الإيصال");
      return;
    }
    if (paymentMethod === "receipt_upload" && !accountHolderName) {
      setError("يرجى إدخال اسم صاحب الحساب");
      return;
    }

    if (paymentMethod === "whatsapp") {
      // إنشاء الطلب ثم فتح واتساب
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("customerName", customerName);
        formData.append("phone", phone);
        formData.append("city", city);
        formData.append("address", address);
        formData.append("notes", notes);
        formData.append("fulfillment", fulfillment);
        formData.append("branchId", selectedBranch);
        formData.append("paymentMethod", "whatsapp");
        formData.append("items", JSON.stringify(items));
        formData.append("subtotal", String(subtotal));
        formData.append("shippingFee", String(actualShippingFee));
        formData.append("total", String(total));

        const res = await fetch("/api/orders", { method: "POST", body: formData });
        if (!res.ok) throw new Error("فشل إنشاء الطلب");
        const data = await res.json();

        const message = encodeURIComponent(buildWhatsAppMessage());
        const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        window.open(waUrl, "_blank");

        clearCart();
        router.push(`/order-confirmation?id=${data.orderId}`);
      } catch {
        setError("حدث خطأ أثناء إنشاء الطلب");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // receipt_upload
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("customerName", customerName);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("notes", notes);
      formData.append("fulfillment", fulfillment);
      formData.append("branchId", selectedBranch);
      formData.append("paymentMethod", "receipt_upload");
      formData.append("items", JSON.stringify(items));
      formData.append("subtotal", String(subtotal));
      formData.append("shippingFee", String(actualShippingFee));
      formData.append("total", String(total));
      formData.append("accountHolderName", accountHolderName);
      formData.append("transferDate", transferDate);
      formData.append("last4", last4);
      if (receiptFile) {
        formData.append("receipt", receiptFile);
      }

      const res = await fetch("/api/orders", { method: "POST", body: formData });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "فشل إنشاء الطلب");
      }
      const data = await res.json();

      clearCart();
      router.push(`/order-confirmation?id=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الطلب");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-cream-300 bg-white py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cream-100 text-oud-300">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <p className="mb-4 text-lg font-medium text-brand-brown-dark">سلتك فارغة</p>
        <a href="/products" className="btn-primary">تصفح المنتجات</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      {/* Left column - data */}
      <div className="space-y-6 lg:col-span-2">
        {/* Customer data */}
        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-medium text-brand-brown-dark">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-brand-brown-dark">1</span>
            بيانات العميل
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">الاسم الكامل *</label>
              <input
                className="input"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">رقم الجوال *</label>
              <input
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                required
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Fulfillment */}
        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-medium text-brand-brown-dark">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-brand-brown-dark">2</span>
            طريقة الاستلام
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setFulfillment("shipping")}
              className={`group flex items-center gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
                fulfillment === "shipping"
                  ? "border-brand-gold bg-cream-100"
                  : "border-cream-300 bg-white hover:border-brand-gold/50"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${fulfillment === "shipping" ? "bg-brand-gold text-brand-brown-dark" : "bg-cream-100 text-brand-gold"}`}>
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-brand-brown-dark">شحن</div>
                <div className="text-xs text-oud-500">
                  {qualifiesFreeShipping ? "شحن مجاني" : `رسوم ${formatPrice(shippingFee)}`}
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFulfillment("pickup")}
              className={`group flex items-center gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
                fulfillment === "pickup"
                  ? "border-brand-gold bg-cream-100"
                  : "border-cream-300 bg-white hover:border-brand-gold/50"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${fulfillment === "pickup" ? "bg-brand-gold text-brand-brown-dark" : "bg-cream-100 text-brand-gold"}`}>
                <Store className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-brand-brown-dark">استلام من الفرع</div>
                <div className="text-xs text-oud-500">بدون رسوم شحن</div>
              </div>
            </button>
          </div>

          {fulfillment === "shipping" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">المدينة *</label>
                <input
                  className="input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">العنوان التفصيلي *</label>
                <input
                  className="input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {fulfillment === "pickup" && (
            <div className="mt-4">
              <label className="label">اختر الفرع *</label>
              <select
                className="input"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
              >
                <option value="">-- اختر --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.address ? `- ${b.address}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4">
            <label className="label">ملاحظات (اختياري)</label>
            <textarea
              className="input min-h-[80px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات إضافية على الطلب..."
            />
          </div>
        </div>

        {/* Payment */}
        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-medium text-brand-brown-dark">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-brand-brown-dark">3</span>
            طريقة الدفع
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("receipt_upload")}
              className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
                paymentMethod === "receipt_upload"
                  ? "border-brand-gold bg-cream-100"
                  : "border-cream-300 bg-white hover:border-brand-gold/50"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === "receipt_upload" ? "bg-brand-gold text-brand-brown-dark" : "bg-cream-100 text-brand-gold"}`}>
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-brand-brown-dark">تحويل بنكي + رفع الإيصال</div>
                <div className="text-xs text-oud-500">ارفع صورة الإيصال وسيتم مراجعته</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("whatsapp")}
              className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
                paymentMethod === "whatsapp"
                  ? "border-brand-gold bg-cream-100"
                  : "border-cream-300 bg-white hover:border-brand-gold/50"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === "whatsapp" ? "bg-green-500 text-white" : "bg-cream-100 text-green-600"}`}>
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-brand-brown-dark">الطلب عبر واتساب</div>
                <div className="text-xs text-oud-500">أرسل الطلب مباشرة عبر واتساب</div>
              </div>
            </button>
          </div>

          {/* تفاصيل التحويل البنكي */}
          {paymentMethod === "receipt_upload" && (
            <div className="mt-6 space-y-5">
              {/* الحسابات البنكية */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-oud-700">الحسابات البنكية</h3>
                <div className="space-y-3">
                  {bankAccounts.map((acc, i) => (
                    <div key={i} className="rounded-xl border border-oud-100 bg-oud-50 p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-oud-900">{acc.bankName}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-oud-600" dir="ltr">{acc.iban}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyIban(acc.iban)}
                          className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-medium text-gold-600 hover:bg-gold-50"
                        >
                          {copiedIban === acc.iban ? (
                            <><Check className="h-3.5 w-3.5" /> تم النسخ</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5" /> نسخ</>
                          )}
                        </button>
                      </div>
                      <div className="mt-1 text-xs text-oud-500">باسم: {acc.holder}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* رفع الإيصال */}
              <div>
                <label className="label">رفع صورة الإيصال *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cream-300 bg-cream-100 p-6 transition-colors hover:border-brand-gold hover:bg-cream-50"
                >
                  {receiptFile ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <Check className="h-5 w-5" />
                      {receiptFile.name}
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-oud-400" />
                      <span className="text-sm text-oud-500">اضغط لرفع صورة أو PDF</span>
                      <span className="mt-1 text-xs text-oud-400">حد أقصى 8 ميجابايت</span>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {/* بيانات التحويل */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">اسم صاحب الحساب *</label>
                  <input
                    className="input"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">تاريخ التحويل</label>
                  <input
                    type="date"
                    className="input"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">آخر 4 أرقام من الحساب (اختياري)</label>
                  <input
                    className="input"
                    value={last4}
                    onChange={(e) => setLast4(e.target.value)}
                    maxLength={4}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* معاينة رسالة واتساب */}
          {paymentMethod === "whatsapp" && (
            <div className="mt-6">
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700">
                  <MessageCircle className="h-4 w-4" />
                  سيتم فتح واتساب برسالة جاهزة
                </div>
                <pre className="whitespace-pre-wrap text-xs text-oud-600 font-sans">
                  {buildWhatsAppMessage()}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right column - order summary */}
      <div className="lg:col-span-1">
        <div className="card sticky top-24 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-medium text-brand-brown-dark">
            <Lock className="h-5 w-5 text-brand-gold" />
            ملخص الطلب
          </h2>
          <ul className="mb-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-cream-100">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="line-clamp-1 font-medium text-brand-brown-dark">{item.name}</div>
                  <div className="text-xs text-oud-500">{item.quantity} × {formatPrice(item.price)}</div>
                </div>
                <span className="font-semibold text-brand-gold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-cream-300 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-oud-600">المجموع الفرعي</span>
              <span className="font-medium text-brand-brown-dark">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-oud-600">الشحن</span>
              <span className="font-medium text-brand-brown-dark">
                {actualShippingFee === 0 ? "مجاني" : formatPrice(actualShippingFee)}
              </span>
            </div>
            {qualifiesFreeShipping && fulfillment === "shipping" && (
              <div className="text-xs text-emerald-600">شحن مجاني للطلبات فوق {formatPrice(freeShippingThreshold)}</div>
            )}
            <div className="flex justify-between border-t border-cream-300 pt-2 text-base font-semibold">
              <span className="text-brand-brown-dark">الإجمالي</span>
              <span className="text-brand-gold">{formatPrice(total)}</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-4 w-full text-base"
          >
            {submitting ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> جاري الإرسال...</>
            ) : paymentMethod === "whatsapp" ? (
              <><MessageCircle className="h-5 w-5" /> إرسال الطلب عبر واتساب</>
            ) : (
              "إرسال الطلب"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
