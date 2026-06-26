"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save, Plus, Trash2, ImageIcon } from "lucide-react";

interface ProductFormProps {
  initialData?: any;
  categories: { id: string; name: string; slug: string }[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price ?? "",
    compareAtPrice: initialData?.compareAtPrice ?? "",
    stock: initialData?.stock ?? 0,
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    sku: initialData?.sku || "",
    barcode: initialData?.barcode || "",
    weight: initialData?.weight ?? "",
    origin: initialData?.origin || "",
    fragranceNotes: initialData?.fragranceNotes || "",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isBestSeller: initialData?.isBestSeller ?? false,
    isNew: initialData?.isNew ?? false,
    images: initialData?.images || [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addImage() {
    if (!imageUrl.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
    setImageUrl("");
  }

  function removeImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_: string, i: number) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEditing ? `/admin/api/products/${initialData.id}` : "/admin/api/products";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل حفظ المنتج");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="card p-6">
        <h2 className="mb-4 font-display text-xl font-medium text-brand-brown-dark">معلومات أساسية</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">اسم المنتج *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">الSlug *</label>
            <input
              className="input"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              required
              dir="ltr"
            />
          </div>
          <div>
            <label className="label">التصنيف *</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              required
            >
              <option value="">— اختر —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">الوصف</label>
            <textarea
              className="input min-h-[100px]"
              value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">وصف مختصر</label>
            <input
              className="input"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-display text-xl font-medium text-brand-brown-dark">التسعير والمخزون</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">السعر *</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              required
              dir="ltr"
            />
          </div>
          <div>
            <label className="label">السعر قبل الخصم</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={form.compareAtPrice}
              onChange={(e) => updateField("compareAtPrice", e.target.value)}
              dir="ltr"
            />
          </div>
          <div>
            <label className="label">المخزون *</label>
            <input
              type="number"
              className="input"
              value={form.stock}
              onChange={(e) => updateField("stock", parseInt(e.target.value) || 0)}
              required
              dir="ltr"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-display text-xl font-medium text-brand-brown-dark">تفاصيل إضافية</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">SKU</label>
            <input
              className="input"
              value={form.sku}
              onChange={(e) => updateField("sku", e.target.value)}
              dir="ltr"
            />
          </div>
          <div>
            <label className="label">الباركود</label>
            <input
              className="input"
              value={form.barcode}
              onChange={(e) => updateField("barcode", e.target.value)}
              dir="ltr"
            />
          </div>
          <div>
            <label className="label">الوزن (غ)</label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={form.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              dir="ltr"
            />
          </div>
          <div>
            <label className="label">بلد المنشأ</label>
            <input
              className="input"
              value={form.origin}
              onChange={(e) => updateField("origin", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">نوتات العطر</label>
            <input
              className="input"
              value={form.fragranceNotes}
              onChange={(e) => updateField("fragranceNotes", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-display text-xl font-medium text-brand-brown-dark">الصور</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            placeholder="رابط الصورة"
            className="input flex-1"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            dir="ltr"
          />
          <button type="button" onClick={addImage} className="btn-outline gap-2">
            <Plus className="h-4 w-4" /> إضافة
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {form.images.map((img: string, i: number) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-cream-100">
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute left-1 top-1 rounded-full bg-red-500 p-1 text-white"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          {form.images.length === 0 && (
            <div className="col-span-4 flex h-24 items-center justify-center rounded-xl border border-dashed border-cream-300 text-oud-400">
              <ImageIcon className="mr-2 h-5 w-5" /> لا توجد صور
            </div>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-display text-xl font-medium text-brand-brown-dark">الإعدادات</h2>
        <div className="flex flex-wrap gap-6">
          {[
            { key: "isActive", label: "نشط" },
            { key: "isFeatured", label: "مميز" },
            { key: "isBestSeller", label: "الأكثر مبيعاً" },
            { key: "isNew", label: "جديد" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-sm text-brand-brown">
              <input
                type="checkbox"
                checked={form[item.key as keyof typeof form] as boolean}
                onChange={(e) => updateField(item.key, e.target.checked)}
                className="h-4 w-4 rounded border-cream-300 text-brand-gold focus:ring-brand-gold"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary gap-2">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          حفظ المنتج
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          إلغاء
        </button>
      </div>
    </form>
  );
}
