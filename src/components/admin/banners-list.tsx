"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import type { SerializedBanner } from "@/lib/serialize";

interface BannersListProps {
  initialBanners: SerializedBanner[];
}

export function BannersList({ initialBanners }: BannersListProps) {
  const [banners, setBanners] = useState<SerializedBanner[]>(initialBanners);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleActive(id: string) {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/admin/api/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setBanners((prev) => prev.map((b) => (b.id === id ? data.banner : b)));
      }
    } catch {}
    setLoadingId(null);
  }

  async function deleteBanner(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا البنر؟")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/admin/api/banners/${id}`, { method: "DELETE" });
      if (res.ok) setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch {}
    setLoadingId(null);
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-cream-300 p-4">
        <Link href="/admin/banners/new" className="btn-primary gap-2 text-sm">
          <Plus className="h-4 w-4" /> إضافة بنر
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-right text-xs text-oud-500">
            <tr>
              <th className="px-4 py-3 font-medium">البنر</th>
              <th className="px-4 py-3 font-medium">المكان</th>
              <th className="px-4 py-3 font-medium">الترتيب</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-cream-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-16 overflow-hidden rounded-lg bg-cream-100">
                      <img src={banner.image} alt={banner.title || ""} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-brand-brown-dark">{banner.title || "—"}</div>
                      <div className="text-xs text-oud-500">{banner.subtitle || ""}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-oud-600">{banner.position}</td>
                <td className="px-4 py-3 text-oud-600">{banner.sortOrder}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${banner.isActive ? "bg-emerald-50 text-emerald-700" : "bg-oud-100 text-oud-500"}`}>
                    {banner.isActive ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/banners/${banner.id}`} className="rounded-lg p-1.5 text-oud-500 hover:bg-cream-100 hover:text-brand-gold">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => toggleActive(banner.id)} disabled={loadingId === banner.id} className="rounded-lg p-1.5 text-oud-500 hover:bg-cream-100 hover:text-brand-gold">
                      {loadingId === banner.id ? <Loader2 className="h-4 w-4 animate-spin" /> : banner.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => deleteBanner(banner.id)} disabled={loadingId === banner.id} className="rounded-lg p-1.5 text-oud-500 hover:bg-red-50 hover:text-red-500">
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
