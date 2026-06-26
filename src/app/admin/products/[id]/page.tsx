import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { serializeProduct } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "تعديل منتج",
};

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">تعديل المنتج</h1>
      <ProductForm initialData={serializeProduct(product)} categories={categories} />
    </div>
  );
}
