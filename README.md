# حكايا الطيب — Hakaya Altayib

متجر إلكتروني فاخر للعود والعطور والبخور، مبني بـ Next.js 14 + Prisma + PostgreSQL.

## الميزات

- واجهة متجر فاخرة بالهوية الجديدة (ألوان، خطوط، تأثيرات حركية).
- إدارة منتجات، تصنيفات، بنرات، عملاء، إيصالات، طلبات الواتساب، سجل النشاطات.
- طلبات استلام من الفرع أو شحن مع حساب رسوم الشحن.
- دفع عبر تحويل بنكي + رفع الإيصال، أو الطلب عبر واتساب.
- لوحة إدارة متكاملة للطلبات والإعدادات.

## المتطلبات

- Node.js 20+
- PostgreSQL 15+
- (اختياري) Docker + Docker Compose

## التشغيل المحلي

```bash
# نسخ المتغيرات
# cp .env.example .env

# تثبيت الحزم
npm install

# إنشاء قاعدة البيانات
npx prisma db push

# زرع البيانات الأولية
npx prisma db seed

# تشغيل خادم التطوير
npm run dev
```

افتح المتجر على: http://localhost:3000

لوحة الإدارة: http://localhost:3000/admin
كلمة المرور الافتراضية: `admin` (يُنصح بتغييرها عبر `ADMIN_PASSWORD`)

## التشغيل بـ Docker

```bash
docker-compose up --build
```

## النشر

المشروع معد للنشر على Railway / Render / VPS عبر Dockerfile.

متغيرات البيئة المطلوبة:
- `DATABASE_URL`: رابط PostgreSQL
- `SESSION_SECRET`: مفتاح طويل لتوقيع الجلسات
- `ADMIN_PASSWORD`: كلمة مرور لوحة الإدارة
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: رقم واتساب المتجر

## سكريبتات npm

- `npm run dev` — تشغيل خادم التطوير
- `npm run build` — بناء الإنتاج
- `npm run typecheck` — فحص TypeScript
- `npm run lint` — فحص ESLint
- `npx prisma db seed` — زرع البيانات

## ملاحظة

تم تطوير المشروع بناءً على MVP سابق وإعادة تصميمه بالكامل لهوية "حكايا الطيب" الفاخرة.
