import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "العملاء",
};

type Customer = { id: string; name: string; phone: string; email: string | null; city: string | null; _count: { orders: number }; createdAt: Date };

export default async function AdminCustomersPage() {
  const customers: Customer[] = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">العملاء</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-right text-xs text-oud-500">
              <tr>
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">الجوال</th>
                <th className="px-4 py-3 font-medium">البريد</th>
                <th className="px-4 py-3 font-medium">المدينة</th>
                <th className="px-4 py-3 font-medium">عدد الطلبات</th>
                <th className="px-4 py-3 font-medium">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {customers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-oud-400">لا يوجد عملاء مسجلون</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50/50">
                    <td className="px-4 py-3 font-medium text-brand-brown-dark">{c.name}</td>
                    <td className="px-4 py-3 text-oud-600" dir="ltr">{c.phone}</td>
                    <td className="px-4 py-3 text-oud-600">{c.email || "—"}</td>
                    <td className="px-4 py-3 text-oud-600">{c.city || "—"}</td>
                    <td className="px-4 py-3 text-oud-600">{c._count.orders}</td>
                    <td className="px-4 py-3 text-xs text-oud-500">{new Date(c.createdAt).toLocaleDateString("ar-SA")}</td>
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
