import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, ADMIN_PASSWORD } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.loggedInAt = Date.now();
  await session.save();

  return NextResponse.json({ success: true });
}
