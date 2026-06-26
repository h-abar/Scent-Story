import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BannerForm } from "@/components/admin/banner-form";
import { serializeBanner } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "تعديل بنر",
};

interface EditBannerPageProps {
  params: { id: string };
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) notFound();

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">تعديل البنر</h1>
      <BannerForm initialData={serializeBanner(banner)} />
    </div>
  );
}
