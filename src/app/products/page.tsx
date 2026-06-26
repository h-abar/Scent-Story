import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductFilters } from "@/components/storefront/product-filters";
import { serializeProducts } from "@/lib/serialize";
import { PackageOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "المتجر",
  description: "تصفّح مجموعة حكايا الطيب الفاخرة من العود والعطور والبخور.",
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    q?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort, q } = searchParams;

  const where = {
    isActive: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : sort === "name"
      ? { name: "asc" as const }
      : { createdAt: "desc" as const };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const activeCategory = categories.find((c: { slug: string }) => c.slug === category);

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Page header */}
      <div className="border-b border-cream-300 bg-warm-white">
        <div className="container-page py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-medium text-brand-brown-dark">
              {activeCategory ? activeCategory.name : "المتجر"}
            </h1>
            <p className="mt-3 text-oud-500">
              {activeCategory
                ? activeCategory.description ?? "منتجات مختارة بعناية"
                : "اكتشف مجموعتنا الفاخرة من العود والعطور والبخور"}
            </p>
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        <ProductFilters
          categories={categories.map((c: { id: string; name: string; slug: string }) => ({ id: c.id, name: c.name, slug: c.slug }))}
          currentCategory={category}
          currentSort={sort}
          query={q}
        />

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-oud-500">
            {products.length} منتج
          </p>
        </div>

        {products.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-cream-300 bg-white py-20 text-center">
            <PackageOpen className="h-16 w-16 text-cream-300" />
            <p className="mt-4 text-lg font-medium text-brand-brown">لا توجد منتجات مطابقة</p>
            <p className="text-sm text-oud-500">جرب البحث بكلمة مختلفة أو تصنيف آخر</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {serializeProducts(products).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
