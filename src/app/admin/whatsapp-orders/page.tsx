import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "طلبات الواتساب",
};

export default async function AdminWhatsAppOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { paymentMethod: "whatsapp" },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">طلبات الواتساب</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-right text-xs text-oud-500">
              <tr>
                <th className="px-4 py-3 font-medium">رقم الطلب</th>
                <th className="px-4 py-3 font-medium">العميل</th>
                <th className="px-4 py-3 font-medium">الجوال</th>
                <th className="px-4 py-3 font-medium">عدد المنتجات</th>
                <th className="px-4 py-3 font-medium">المبلغ</th>
                <th className="px-4 py-3 font-medium">التاريخ</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-oud-400">لا توجد طلبات واتساب</td></tr>
              ) : (
                orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-cream-50/50">
                    <td className="px-4 py-3 font-medium text-brand-brown-dark">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-oud-600">{o.customerName}</td>
                    <td className="px-4 py-3 text-oud-600" dir="ltr">{o.phone}</td>
                    <td className="px-4 py-3 text-oud-600">{o.items.length}</td>
                    <td className="px-4 py-3 font-medium text-brand-gold">{formatPrice(Number(o.total))}</td>
                    <td className="px-4 py-3 text-xs text-oud-500">{new Date(o.createdAt).toLocaleDateString("ar-SA")}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${o.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
