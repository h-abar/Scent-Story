import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { Decimal } from "@prisma/client/runtime/library";
import { serializeProduct } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) {
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
  }

  return NextResponse.json({ product: serializeProduct(product) });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "بيانات الطلب غير صالحة" }, { status: 400 });
  }

  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.slug !== undefined) data.slug = body.slug;
  if (body.description !== undefined) data.description = body.description;
  if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
  if (body.price !== undefined) data.price = new Decimal(body.price);
  if (body.compareAtPrice !== undefined) data.compareAtPrice = body.compareAtPrice ? new Decimal(body.compareAtPrice) : null;
  if (body.stock !== undefined) data.stock = Number(body.stock);
  if (body.categoryId !== undefined) data.categoryId = body.categoryId;
  if (body.images !== undefined) data.images = body.images;
  if (body.sku !== undefined) data.sku = typeof body.sku === "string" && body.sku.trim() ? body.sku.trim() : null;
  if (body.barcode !== undefined) data.barcode = typeof body.barcode === "string" && body.barcode.trim() ? body.barcode.trim() : null;
  if (body.weight !== undefined) data.weight = body.weight ? new Decimal(body.weight) : null;
  if (body.origin !== undefined) data.origin = body.origin;
  if (body.fragranceNotes !== undefined) data.fragranceNotes = body.fragranceNotes;
  if (body.isActive !== undefined) data.isActive = !!body.isActive;
  if (body.isFeatured !== undefined) data.isFeatured = !!body.isFeatured;
  if (body.isBestSeller !== undefined) data.isBestSeller = !!body.isBestSeller;
  if (body.isNew !== undefined) data.isNew = !!body.isNew;

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data,
      include: { category: true },
    });

    return NextResponse.json({ product: serializeProduct(product) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "فشل تحديث المنتج" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
