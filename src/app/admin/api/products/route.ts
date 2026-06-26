import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { Decimal } from "@prisma/client/runtime/library";
import { serializeProduct } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return NextResponse.json({ products: products.map(serializeProduct) });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug, description, shortDescription, price, compareAtPrice, stock, categoryId, images, sku, barcode, weight, origin, fragranceNotes, isActive, isFeatured, isBestSeller, isNew } = body;

  if (!name || !slug || !categoryId || price === undefined) {
    return NextResponse.json({ error: "البيانات المطلوبة ناقصة" }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price: new Decimal(price),
        compareAtPrice: compareAtPrice ? new Decimal(compareAtPrice) : null,
        stock: Number(stock),
        categoryId,
        images: images || [],
        sku,
        barcode,
        weight: weight ? new Decimal(weight) : null,
        origin,
        fragranceNotes,
        isActive: !!isActive,
        isFeatured: !!isFeatured,
        isBestSeller: !!isBestSeller,
        isNew: !!isNew,
      },
      include: { category: true },
    });

    return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل إنشاء المنتج" }, { status: 500 });
  }
}
