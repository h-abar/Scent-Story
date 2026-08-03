import Link from "next/link";

export const metadata = { title: "حسابي" };

export default function AccountPage() {
  return (
    <main className="container-page py-20 text-center">
      <h1 className="section-title">حسابي</h1>
      <p className="section-subtitle mx-auto mt-4 max-w-xl">تسجيل الحسابات غير متاح حاليًا. يمكنك متابعة طلبك مباشرة من خلال رقم الطلب.</p>
      <Link href="/track-order" className="btn-primary mt-8 inline-flex">تتبع الطلب</Link>
    </main>
  );
}
