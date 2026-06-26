import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">الإعدادات</h1>
      <SettingsForm
        initialSettings={{
          storeName: settings?.storeName ?? "حكايا الطيب",
          storeNameEn: settings?.storeNameEn ?? "Hakaya Altayib",
          whatsappNumber: settings?.whatsappNumber ?? "",
          email: settings?.email ?? "",
          phone: settings?.phone ?? "",
          address: settings?.address ?? "",
          shippingFee: Number(settings?.shippingFee ?? 25),
          freeShippingThreshold: settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : 0,
          currency: settings?.currency ?? "SAR",
          taxRate: Number(settings?.taxRate ?? 0),
          bankAccounts: (settings?.bankAccounts as any[]) ?? [],
          socialLinks: (settings?.socialLinks as any) ?? {},
          metaTitle: settings?.metaTitle ?? "",
          metaDescription: settings?.metaDescription ?? "",
          footerText: settings?.footerText ?? "",
        }}
      />
    </div>
  );
}
