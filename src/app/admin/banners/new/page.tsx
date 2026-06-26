import { BannerForm } from "@/components/admin/banner-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إضافة بنر",
};

export default function NewBannerPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">إضافة بنر جديد</h1>
      <BannerForm />
    </div>
  );
}
