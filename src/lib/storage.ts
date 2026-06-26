import { promises as fs } from "fs";
import path from "path";

/**
 * واجهة خدمة التخزين — تجريد يسمح باستبدال التنفيذ المحلي
 * لاحقًا بـ Cloudflare R2 أو AWS S3 دون تغيير الكود المستهلك.
 */
export interface StorageService {
  /** يرفع ملفًا ويعيد المسار/الرابط النسبي المعروض للعميل */
  upload(file: File): Promise<{ url: string; key: string }>;
  /** يحذف ملفًا حسب المفتاح (تنظيف اختياري) */
  delete?(key: string): Promise<void>;
}

// ========== تنفيذ محلي (Local Volume) ==========

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "data", "uploads");

function ensureSafeExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  // امتدادات مسموحة فقط (إيصالات وصور منتجات)
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
  return allowed.includes(ext) ? ext : ".bin";
}

export class LocalStorageService implements StorageService {
  async upload(file: File): Promise<{ url: string; key: string }> {
    // التأكد من وجود المجلد
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeExt = ensureSafeExt(file.name);
    const baseName =
      path.basename(file.name, path.extname(file.name)).replace(/[^\w\u0600-\u06FF-]+/g, "_").slice(0, 40) || "file";
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${baseName}${safeExt}`;

    const fullPath = path.join(UPLOAD_DIR, fileName);
    await fs.writeFile(fullPath, buffer);

    // المسار النسبي يُخدَّم عبر Route Handler في /api/uploads/[file]
    const key = fileName;
    const url = `/api/uploads/${fileName}`;
    return { url, key };
  }

  /** مسار فعلي على القرص لملف معيّن (يُستخدم من route العرض) */
  static resolvePath(fileName: string): string {
    // منع تجاوز المسار
    const safe = path.basename(fileName);
    return path.join(UPLOAD_DIR, safe);
  }
}

// نسخة وحيدة مشتركة
let _storage: StorageService | null = null;
export function getStorage(): StorageService {
  if (!_storage) _storage = new LocalStorageService();
  return _storage;
}

// الحد الأقصى لحجم الإيصال: 8 ميجابايت
export const MAX_RECEIPT_SIZE = 8 * 1024 * 1024;
