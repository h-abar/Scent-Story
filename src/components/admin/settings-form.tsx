"use client";

import { useState } from "react";
import { Loader2, Save, Plus, Trash2, Check } from "lucide-react";

interface BankAccount {
  bankName: string;
  iban: string;
  holder: string;
}

interface SettingsData {
  storeName: string;
  storeNameEn: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  shippingFee: number;
  freeShippingThreshold: number;
  currency: string;
  taxRate: number;
  bankAccounts: BankAccount[];
  socialLinks: any;
  metaTitle: string;
  metaDescription: string;
  footerText: string;
}

interface SettingsFormProps {
  initialSettings: SettingsData;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField<K extends keyof SettingsData>(key: K, value: SettingsData[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function addBankAccount() {
    setSettings((prev) => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, { bankName: "", iban: "", holder: "" }],
    }));
  }

  function updateBankAccount(index: number, field: keyof BankAccount, value: string) {
    setSettings((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((acc, i) =>
        i === index ? { ...acc, [field]: value } : acc
      ),
    }));
  }

  function removeBankAccount(index: number) {
    setSettings((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/admin/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-6">
      {/* معلومات المتجر */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-oud-900">معلومات المتجر</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">اسم المتجر</label>
            <input
              className="input"
              value={settings.storeName}
              onChange={(e) => updateField("storeName", e.target.value)}
            />
          </div>
          <div>
            <label className="label">رقم واتساب (دولي بدون +)</label>
            <input
              className="input"
              value={settings.whatsappNumber}
              onChange={(e) => updateField("whatsappNumber", e.target.value)}
              placeholder="966500000000"
              dir="ltr"
            />
          </div>
          <div>
            <label className="label">العملة</label>
            <select
              className="input"
              value={settings.currency}
              onChange={(e) => updateField("currency", e.target.value)}
            >
              <option value="SAR">ريال سعودي (SAR)</option>
              <option value="AED">درهم إماراتي (AED)</option>
              <option value="USD">دولار أمريكي (USD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* الشحن */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-oud-900">إعدادات الشحن</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">رسوم الشحن (ر.س)</label>
            <input
              type="number"
              className="input"
              value={settings.shippingFee}
              onChange={(e) => updateField("shippingFee", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">حد الشحن المجاني (ر.س) — 0 = معطل</label>
            <input
              type="number"
              className="input"
              value={settings.freeShippingThreshold}
              onChange={(e) => updateField("freeShippingThreshold", parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* الحسابات البنكية */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-oud-900">الحسابات البنكية</h2>
          <button
            type="button"
            onClick={addBankAccount}
            className="btn-outline text-sm"
          >
            <Plus className="h-4 w-4" />
            إضافة حساب
          </button>
        </div>

        {settings.bankAccounts.length === 0 ? (
          <p className="text-sm text-oud-400">لا توجد حسابات بنكية مضافة</p>
        ) : (
          <div className="space-y-4">
            {settings.bankAccounts.map((acc, i) => (
              <div key={i} className="rounded-xl border border-oud-100 bg-oud-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-oud-700">حساب #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeBankAccount(i)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">اسم البنك</label>
                    <input
                      className="input"
                      value={acc.bankName}
                      onChange={(e) => updateBankAccount(i, "bankName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">رقم الآيبان (IBAN)</label>
                    <input
                      className="input"
                      value={acc.iban}
                      onChange={(e) => updateBankAccount(i, "iban", e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="label">اسم صاحب الحساب</label>
                    <input
                      className="input"
                      value={acc.holder}
                      onChange={(e) => updateBankAccount(i, "holder", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* زر الحفظ */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          حفظ الإعدادات
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check className="h-4 w-4" />
            تم الحفظ بنجاح
          </span>
        )}
      </div>
    </form>
  );
}
