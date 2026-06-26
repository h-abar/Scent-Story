"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { SerializedProduct } from "@/lib/serialize";

interface ProductsListProps {
  initialProducts: SerializedProduct[];
  categories: { id: string; name: string; slug: string }[];
}

export function ProductsList({ initialProducts, categories }: ProductsListProps) {
  const [products, setProducts] = useState<SerializedProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleActive(id: string) {
    setLoadingId(id);
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      const res = await fetch(`/admin/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
      }
    } catch {
      // ignore
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/admin/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-300 p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-oud-400" />
          <input
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pr-9 text-sm"
            style={{ width: "240px" }}
          />
        </div>
        <Link href="/admin/products/new" className="btn-primary gap-2 text-sm">
          <Plus className="h-4 w-4" /> إضافة منتج
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-right text-xs text-oud-500">
            <tr>
              <th className="px-4 py-3 font-medium">المنتج</th>
              <th className="px-4 py-3 font-medium">الفئة</th>
              <th className="px-4 py-3 font-medium">السعر</th>
              <th className="px-4 py-3 font-medium">المخزون</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-oud-400">
                  لا توجد منتجات
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="hover:bg-cream-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-cream-100">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-oud-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-brand-brown-dark">{product.name}</div>
                        <div className="text-xs text-oud-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-oud-600">
                    {categories.find((c) => c.id === product.categoryId)?.name || "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-gold">
                    {product.compareAtPrice ? (
                      <div className="flex items-center gap-2">
                        <span>{formatPrice(Number(product.price))}</span>
                        <span className="text-xs text-oud-400 line-through">
                          {formatPrice(Number(product.compareAtPrice))}
                        </span>
                      </div>
                    ) : (
                      formatPrice(Number(product.price))
                    )}
                  </td>
                  <td className="px-4 py-3 text-oud-600">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-oud-100 text-oud-500"
                      }`}
                    >
                      {product.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="rounded-lg p-1.5 text-oud-500 hover:bg-cream-100 hover:text-brand-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => toggleActive(product.id)}
                        disabled={loadingId === product.id}
                        className="rounded-lg p-1.5 text-oud-500 hover:bg-cream-100 hover:text-brand-gold"
                      >
                        {loadingId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : product.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        disabled={loadingId === product.id}
                        className="rounded-lg p-1.5 text-oud-500 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
