import { prisma } from "@/lib/prisma";
import { AdminOrdersList } from "@/components/admin/orders-list";
import { serializeOrders } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const initialOrders = await prisma.order.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true, branch: true },
  });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-oud-900">الطلبات</h1>
      <div className="card overflow-hidden">
        <AdminOrdersList initialOrders={serializeOrders(initialOrders)} />
      </div>
    </div>
  );
}
