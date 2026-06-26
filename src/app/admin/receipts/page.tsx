import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "مراجعة الإيصالات",
};

export default async function AdminReceiptsPage() {
  const payments = await prisma.payment.findMany({
    where: { method: "receipt_upload" },
    orderBy: { createdAt: "desc" },
    include: { order: true },
  });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">الإيصالات</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-right text-xs text-oud-500">
              <tr>
                <th className="px-4 py-3 font-medium">رقم الطلب</th>
                <th className="px-4 py-3 font-medium">الحساب</th>
                <th className="px-4 py-3 font-medium">تاريخ التحويل</th>
                <th className="px-4 py-3 font-medium">المبلغ</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">الإيصال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {payments.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-oud-400">لا توجد إيصالات</td></tr>
              ) : (
                payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-cream-50/50">
                    <td className="px-4 py-3 font-medium text-brand-brown-dark">{p.order.orderNumber}</td>
                    <td className="px-4 py-3 text-oud-600">{p.accountHolderName || "—"}</td>
                    <td className="px-4 py-3 text-oud-600">{p.transferDate ? new Date(p.transferDate).toLocaleDateString("ar-SA") : "—"}</td>
                    <td className="px-4 py-3 font-medium text-brand-gold">{formatPrice(Number(p.order.total))}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "approved" ? "bg-emerald-50 text-emerald-700" : p.status === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                        {p.status === "approved" ? "مقبول" : p.status === "rejected" ? "مرفوض" : "معلّق"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.receiptUrl ? (
                        <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-gold hover:underline">
                          عرض الإيصال
                        </a>
                      ) : "—"}
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
