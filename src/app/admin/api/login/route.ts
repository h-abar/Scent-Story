import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, getAdminPassword } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  let adminPassword: string;
  try {
    adminPassword = getAdminPassword();
  } catch {
    return NextResponse.json({ error: "إعدادات دخول الأدمن غير مكتملة" }, { status: 503 });
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.loggedInAt = Date.now();
  await session.save();

  return NextResponse.json({ success: true });
}
