"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";

interface BannerFormProps {
  initialData?: any;
}

const POSITIONS = [
  { value: "home_hero", label: "Home Hero" },
  { value: "home_promo", label: "Home Promo" },
  { value: "category_top", label: "Category Top" },
];

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    image: initialData?.image || "",
    link: initialData?.link || "",
    position: initialData?.position || "home_hero",
    sortOrder: initialData?.sortOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEditing ? `/admin/api/banners/${initialData.id}` : "/admin/api/banners";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل حفظ البنر");
      router.push("/admin/banners");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <div className="card p-6">
        <h2 className="mb-4 font-display text-xl font-medium text-brand-brown-dark">بيانات البنر</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">العنوان</label>
            <input className="input" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
          </div>
          <div>
            <label className="label">العنوان الفرعي</label>
            <input className="input" value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">رابط الصورة *</label>
            <input className="input" value={form.image} onChange={(e) => updateField("image", e.target.value)} required dir="ltr" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">الرابط عند النقر</label>
            <input className="input" value={form.link} onChange={(e) => updateField("link", e.target.value)} dir="ltr" />
          </div>
          <div>
            <label className="label">المكان</label>
            <select className="input" value={form.position} onChange={(e) => updateField("position", e.target.value)}>
              {POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">الترتيب</label>
            <input type="number" className="input" value={form.sortOrder} onChange={(e) => updateField("sortOrder", parseInt(e.target.value) || 0)} dir="ltr" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" checked={form.isActive} onChange={(e) => updateField("isActive", e.target.checked)} className="h-4 w-4 rounded border-cream-300 text-brand-gold focus:ring-brand-gold" />
            <span className="text-sm text-brand-brown">نشط</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary gap-2">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          حفظ البنر
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">إلغاء</button>
      </div>
    </form>
  );
}
