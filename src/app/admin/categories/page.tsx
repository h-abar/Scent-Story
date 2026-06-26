import { prisma } from "@/lib/prisma";
import { CategoriesList } from "@/components/admin/categories-list";
import { serializeCategories } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إدارة التصنيفات",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">التصنيفات</h1>
      <CategoriesList initialCategories={serializeCategories(categories)} />
    </div>
  );
}
