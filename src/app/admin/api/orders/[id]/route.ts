import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payment: true, branch: true },
  });

  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const { status, paymentStatus, rejectionReason } = body;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { payment: true },
  });

  if (!order) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }

  // تحديث حالة الطلب
  const updateData: any = {};
  if (status) updateData.status = status;

  // تحديث حالة الدفع
  if (paymentStatus && order.payment) {
    updateData.payment = {
      update: {
        status: paymentStatus,
        verifiedBy: "admin",
        verifiedAt: new Date(),
        ...(rejectionReason ? { rejectionReason } : {}),
      },
    };

    // إذا تم تأكيد الدفع، حدّث حالة الطلب تلقائيًا
    if (paymentStatus === "approved" && !status) {
      updateData.status = "payment_confirmed";
    }
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: updateData,
    include: { items: true, payment: true, branch: true },
  });

  return NextResponse.json({ order: updated });
}
