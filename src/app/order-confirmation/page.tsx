import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/utils";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface OrderConfirmationProps {
  searchParams: { id?: string };
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationProps) {
  const order = await prisma.order.findUnique({
    where: { id: searchParams.id },
    include: { items: true, payment: true, branch: true },
  });

  if (!order) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg text-oud-500">الطلب غير موجود</p>
        <Link href="/products" className="btn-primary mt-4">تصفح المنتجات</Link>
      </div>
    );
  }

  const isWhatsapp = order.paymentMethod === "whatsapp";

  return (
    <div className="container-page max-w-2xl py-12">
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="mb-2 font-display text-2xl text-oud-900">تم استلام طلبك بنجاح</h1>
        <p className="mb-1 text-sm text-oud-500">رقم الطلب: <span className="font-bold text-oud-800">{order.orderNumber}</span></p>
        <p className="mb-6 text-sm text-oud-500">{formatDate(order.createdAt)}</p>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
          <Clock className="h-4 w-4" />
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </div>

        {isWhatsapp && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <p className="mb-2 font-semibold">تم فتح واتساب لإرسال الطلب</p>
            <p>إذا لم يفتح واتساب تلقائيًا، يمكنك إرسال الطلب يدويًا عبر الزر أدناه</p>
          </div>
        )}

        {/* ملخص الطلب */}
        <div className="mb-6 rounded-xl bg-oud-50 p-4 text-right">
          <h2 className="mb-3 text-sm font-bold text-oud-900">تفاصيل الطلب</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span className="text-oud-600">{item.name} ×{item.quantity}</span>
                <span className="font-medium">{formatPrice(Number(item.price) * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-oud-200 pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-oud-600">الشحن</span>
              <span>{Number(order.shippingFee) > 0 ? formatPrice(Number(order.shippingFee)) : "مجاني"}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-oud-900">الإجمالي</span>
              <span className="text-gold-700">{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/track-order" className="btn-outline">تتبع الطلب</Link>
          <Link href="/products" className="btn-primary">متابعة التسوق</Link>
        </div>
      </div>
    </div>
  );
}
