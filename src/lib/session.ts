import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export interface AdminSession {
  isLoggedIn?: boolean;
  loggedInAt?: number;
}

export function getSessionOptions(): SessionOptions {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must be set and contain at least 32 characters");
  }

  return {
    password: sessionSecret,
    cookieName: "scent_story_admin",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // أسبوع واحد
      path: "/",
    },
  };
}

// للـ Server Components و Route Handlers
export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSession>(cookieStore, getSessionOptions());
  return session;
}

export function isAdminLoggedIn(session: AdminSession) {
  return session.isLoggedIn === true;
}

export function getAdminPassword(): string {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD must be set");
  }
  return adminPassword;
}
