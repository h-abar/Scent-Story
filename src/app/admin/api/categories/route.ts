import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { serializeCategory } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ categories: categories.map(serializeCategory) });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json();
  const { name, slug, description, image, sortOrder, isActive, seoTitle, seoDescription } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "الاسم والslug مطلوبان" }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        sortOrder: Number(sortOrder) || 0,
        isActive: !!isActive,
        seoTitle,
        seoDescription,
      },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ category: serializeCategory(category) }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل إنشاء التصنيف" }, { status: 500 });
  }
}
