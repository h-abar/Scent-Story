import { CategoryForm } from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إضافة تصنيف",
};

export default function NewCategoryPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">إضافة تصنيف جديد</h1>
      <CategoryForm />
    </div>
  );
}
