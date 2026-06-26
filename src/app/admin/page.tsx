import { prisma } from "@/lib/prisma";
import { AdminOrdersList } from "@/components/admin/orders-list";
import { serializeOrders } from "@/lib/serialize";
import { formatPrice } from "@/lib/utils";
import { Package, Clock, CheckCircle, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalOrders, pendingOrders, completedOrders, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: {
        status: { in: ["new", "awaiting_transfer", "receipt_uploaded", "under_review", "payment_confirmed", "preparing"] },
      },
    }),
    prisma.order.count({ where: { status: "completed" } }),
    prisma.order.aggregate({
      where: { status: { in: ["payment_confirmed", "preparing", "shipped", "completed"] } },
      _sum: { total: true },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true },
  });

  const stats = [
    { label: "إجمالي الطلبات", value: totalOrders, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "طلبات قيد المعالجة", value: pendingOrders, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "طلبات مكتملة", value: completedOrders, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "إجمالي الإيرادات", value: formatPrice(Number(totalRevenue._sum.total ?? 0)), icon: DollarSign, color: "bg-cream-100 text-brand-gold" },
  ] as const;

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">لوحة التحكم</h1>

      {/* الإحصائيات */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-brand-brown-dark">{stat.value}</div>
            <div className="text-sm text-oud-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* الطلبات الأخيرة */}
      <div className="card overflow-hidden">
        <div className="border-b border-cream-300 p-4">
          <h2 className="font-bold text-brand-brown-dark">أحدث الطلبات</h2>
        </div>
        <AdminOrdersList initialOrders={serializeOrders(recentOrders)} />
      </div>
    </div>
  );
}
