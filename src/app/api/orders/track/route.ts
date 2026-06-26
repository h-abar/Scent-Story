import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ orders: [] });
  }

  // البحث برقم الطلب أو رقم الجوال
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ orders });
}
