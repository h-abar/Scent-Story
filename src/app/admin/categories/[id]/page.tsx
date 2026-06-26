import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { serializeCategory } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "تعديل تصنيف",
};

interface EditCategoryPageProps {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) notFound();

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">تعديل التصنيف</h1>
      <CategoryForm initialData={serializeCategory(category)} />
    </div>
  );
}
