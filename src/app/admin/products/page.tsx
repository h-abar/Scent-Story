import { prisma } from "@/lib/prisma";
import { ProductsList } from "@/components/admin/products-list";
import { serializeProducts } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إدارة المنتجات",
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">المنتجات</h1>
      <ProductsList initialProducts={serializeProducts(products)} categories={categories} />
    </div>
  );
}
