import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { serializeProducts } from "@/lib/serialize";

export const revalidate = 3600;

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!category) notFound();

  const allCategories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="container-page py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-oud-400">
        <Link href="/" className="hover:text-gold-600">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gold-600">المتجر</Link>
        <span>/</span>
        <span className="text-oud-700 font-medium">{category.name}</span>
      </nav>

      <h1 className="mb-2 font-display text-3xl font-bold text-oud-800">{category.name}</h1>
      <p className="mb-6 text-oud-500">{category.products.length} منتج</p>

      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className="rounded-lg border border-oud-200 px-3 py-1.5 text-sm font-medium text-oud-600 hover:bg-oud-50"
        >
          الكل
        </Link>
        {allCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              cat.slug === params.slug
                ? "border-gold-500 bg-gold-50 text-gold-700"
                : "border-oud-200 text-oud-600 hover:bg-oud-50"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {category.products.length === 0 ? (
        <div className="card p-12 text-center text-oud-400">
          لا توجد منتجات في هذه الفئة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {serializeProducts(category.products).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
