import { TrackOrderForm } from "@/components/storefront/track-order-form";

export const metadata = { title: "تتبع الطلب" };

export default function TrackOrderPage() {
  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="mb-6 font-display text-3xl text-oud-900">تتبع الطلب</h1>
      <p className="mb-6 text-sm text-oud-500">
        أدخل رقم الطلب أو رقم الجوال لمعرفة حالة طلبك
      </p>
      <TrackOrderForm />
    </div>
  );
}
