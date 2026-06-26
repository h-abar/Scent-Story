import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { serializeCategory } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 });

  return NextResponse.json({ category: serializeCategory(category) });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json();
  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.slug !== undefined) data.slug = body.slug;
  if (body.description !== undefined) data.description = body.description;
  if (body.image !== undefined) data.image = body.image;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  if (body.isActive !== undefined) data.isActive = !!body.isActive;
  if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle;
  if (body.seoDescription !== undefined) data.seoDescription = body.seoDescription;

  const category = await prisma.category.update({
    where: { id: params.id },
    data,
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ category: serializeCategory(category) });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
