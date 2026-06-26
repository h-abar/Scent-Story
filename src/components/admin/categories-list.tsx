"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import type { SerializedCategory } from "@/lib/serialize";

interface CategoriesListProps {
  initialCategories: SerializedCategory[];
}

export function CategoriesList({ initialCategories }: CategoriesListProps) {
  const [categories, setCategories] = useState<SerializedCategory[]>(initialCategories);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleActive(id: string) {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/admin/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !category.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === id ? data.category : c)));
      }
    } catch {}
    setLoadingId(null);
  }

  async function deleteCategory(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا التصنيف؟")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/admin/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {}
    setLoadingId(null);
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-cream-300 p-4">
        <Link href="/admin/categories/new" className="btn-primary gap-2 text-sm">
          <Plus className="h-4 w-4" /> إضافة تصنيف
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-right text-xs text-oud-500">
            <tr>
              <th className="px-4 py-3 font-medium">التصنيف</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">المنتجات</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-cream-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-cream-100">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="font-medium text-brand-brown-dark">{cat.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-oud-500" dir="ltr">{cat.slug}</td>
                <td className="px-4 py-3 text-oud-600">{cat.productCount || 0}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-oud-100 text-oud-500"}`}>
                    {cat.isActive ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/categories/${cat.id}`} className="rounded-lg p-1.5 text-oud-500 hover:bg-cream-100 hover:text-brand-gold">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => toggleActive(cat.id)} disabled={loadingId === cat.id} className="rounded-lg p-1.5 text-oud-500 hover:bg-cream-100 hover:text-brand-gold">
                      {loadingId === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : cat.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} disabled={loadingId === cat.id} className="rounded-lg p-1.5 text-oud-500 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
