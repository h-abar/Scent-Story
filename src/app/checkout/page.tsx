import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/storefront/checkout-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إتمام الطلب",
  description: "أكمل طلبك من حكايا الطيب بخطوات بسيطة.",
};

export default async function CheckoutPage() {
  const [branches, settings] = await Promise.all([
    prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  const bankAccounts = settings?.bankAccounts as Array<{
    bankName: string;
    iban: string;
    holder: string;
  }> | null;

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="border-b border-cream-300 bg-warm-white">
        <div className="container-page py-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-3xl font-medium text-brand-brown-dark md:text-4xl">إتمام الطلب</h1>
            <p className="mt-2 text-oud-500">بضع خطوات بسيطة تفصلك عن تجربة عطرية فاخرة</p>
          </div>
        </div>
      </div>
      <div className="container-page py-10">
        <CheckoutForm
          branches={branches.map((b: { id: string; name: string; address: string | null }) => ({ id: b.id, name: b.name, address: b.address }))}
          shippingFee={Number(settings?.shippingFee ?? 25)}
          freeShippingThreshold={Number(settings?.freeShippingThreshold ?? 0)}
          whatsappNumber={settings?.whatsappNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}
          bankAccounts={bankAccounts ?? []}
        />
      </div>
    </div>
  );
}
