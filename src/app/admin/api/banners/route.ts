import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { serializeBanner } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ banners: banners.map(serializeBanner) });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json();
  const { title, subtitle, image, link, position, sortOrder, isActive } = body;

  if (!image) return NextResponse.json({ error: "صورة البنر مطلوبة" }, { status: 400 });

  try {
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image,
        link,
        position,
        sortOrder: Number(sortOrder) || 0,
        isActive: !!isActive,
      },
    });
    return NextResponse.json({ banner: serializeBanner(banner) }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "فشل إنشاء البنر" }, { status: 500 });
  }
}
