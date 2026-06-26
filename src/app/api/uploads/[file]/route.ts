import { NextRequest, NextResponse } from "next/server";
import { LocalStorageService } from "@/lib/storage";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { file: string } }
) {
  const fileName = path.basename(params.file);
  const filePath = LocalStorageService.resolvePath(fileName);

  try {
    await fs.access(filePath);
  } catch {
    return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
  }

  const buffer = await fs.readFile(filePath);
  const ext = path.extname(fileName).toLowerCase();

  const contentType =
    ext === ".pdf"
      ? "application/pdf"
      : ext === ".png"
      ? "image/png"
      : ext === ".webp"
      ? "image/webp"
      : "image/jpeg";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
