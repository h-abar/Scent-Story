import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { getSessionOptions, type AdminSession } from "@/lib/session";

// الحقول العامة المسموح بها بدون تسجيل دخول
const PUBLIC_PATHS = ["/admin/login", "/admin/api/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // حماية كل ما يبدأ بـ /admin عدا صفحة الدخول
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // التحقق من الجلسة
  const res = NextResponse.next();
  let session: AdminSession;
  try {
    session = await getIronSession<AdminSession>(req, res, getSessionOptions());
  } catch {
    return NextResponse.json({ error: "إعدادات حماية لوحة الإدارة غير مكتملة" }, { status: 503 });
  }

  if (!session.isLoggedIn) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
