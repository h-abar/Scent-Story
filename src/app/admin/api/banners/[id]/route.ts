import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { serializeBanner } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) return NextResponse.json({ error: "البنر غير موجود" }, { status: 404 });

  return NextResponse.json({ banner: serializeBanner(banner) });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json();
  const data: any = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.subtitle !== undefined) data.subtitle = body.subtitle;
  if (body.image !== undefined) data.image = body.image;
  if (body.link !== undefined) data.link = body.link;
  if (body.position !== undefined) data.position = body.position;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  if (body.isActive !== undefined) data.isActive = !!body.isActive;

  const banner = await prisma.banner.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ banner: serializeBanner(banner) });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  await prisma.banner.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
