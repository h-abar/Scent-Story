"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";

interface CategoryFormProps {
  initialData?: any;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    sortOrder: initialData?.sortOrder ?? 0,
    isActive: initialData?.isActive ?? true,
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
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
      const url = isEditing ? `/admin/api/categories/${initialData.id}` : "/admin/api/categories";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل حفظ التصنيف");
      router.push("/admin/categories");
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
        <h2 className="mb-4 font-display text-xl font-medium text-brand-brown-dark">بيانات التصنيف</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">الاسم *</label>
            <input className="input" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
          </div>
          <div>
            <label className="label">Slug *</label>
            <input className="input" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required dir="ltr" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">الوصف</label>
            <textarea className="input min-h-[80px]" value={form.description} onChange={(e) => updateField("description", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">رابط صورة التصنيف</label>
            <input className="input" value={form.image} onChange={(e) => updateField("image", e.target.value)} dir="ltr" />
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

      <div className="card p-6">
        <h2 className="mb-4 font-display text-xl font-medium text-brand-brown-dark">SEO</h2>
        <div className="grid gap-4">
          <div>
            <label className="label">عنوان SEO</label>
            <input className="input" value={form.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} />
          </div>
          <div>
            <label className="label">وصف SEO</label>
            <textarea className="input min-h-[80px]" value={form.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary gap-2">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          حفظ التصنيف
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">إلغاء</button>
      </div>
    </form>
  );
}
