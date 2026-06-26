import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export interface AdminSession {
  isLoggedIn?: boolean;
  loggedInAt?: number;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "development-insecure-secret-please-change-this-32+chars-long-padding-for-security",
  cookieName: "scent_story_admin",
  cookieOptions: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // أسبوع واحد
    path: "/",
  },
};

// للـ Server Components و Route Handlers
export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSession>(cookieStore, sessionOptions);
  return session;
}

export function isAdminLoggedIn(session: AdminSession) {
  return session.isLoggedIn === true;
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";
