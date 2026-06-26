import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إضافة منتج",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">إضافة منتج جديد</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
