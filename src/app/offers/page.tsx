import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { serializeProducts } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const metadata = { title: "العروض" };

export default async function OffersPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true, compareAtPrice: { not: null } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="section-title">العروض</h1>
        <p className="section-subtitle">استفد من عروضنا على منتجات مختارة</p>
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {serializeProducts(products).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-cream-300 bg-white py-16 text-center text-oud-500">
          لا توجد عروض متاحة حاليًا. <Link href="/products" className="text-brand-gold">تصفح جميع المنتجات</Link>
        </div>
      )}
    </main>
  );
}
