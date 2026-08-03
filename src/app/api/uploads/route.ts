import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { getStorage } from "@/lib/storage";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم اختيار صورة" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WebP" }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "حجم الصورة يجب ألا يتجاوز 10 ميجابايت" }, { status: 400 });
  }

  try {
    const result = await getStorage().upload(file);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Image upload failed", error);
    return NextResponse.json({ error: "تعذر رفع الصورة" }, { status: 500 });
  }
}
