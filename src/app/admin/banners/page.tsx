import { prisma } from "@/lib/prisma";
import { BannersList } from "@/components/admin/banners-list";
import { serializeBanners } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إدارة البنرات",
};

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">البنرات</h1>
      <BannersList initialBanners={serializeBanners(banners)} />
    </div>
  );
}
