import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderDetail } from "@/components/admin/order-detail";
import { serializeOrder } from "@/lib/serialize";

export const dynamic = "force-dynamic";

interface AdminOrderDetailPageProps {
  params: { id: string };
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payment: true, branch: true },
  });

  if (!order) notFound();

  return (
    <div className="container-page py-8">
      <OrderDetail order={serializeOrder(order)} />
    </div>
  );
}
