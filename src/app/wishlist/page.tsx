import Link from "next/link";

export const metadata = { title: "المفضلة" };

export default function WishlistPage() {
  return (
    <main className="container-page py-20 text-center">
      <h1 className="section-title">المفضلة</h1>
      <p className="section-subtitle mx-auto mt-4 max-w-xl">أضف المنتجات التي تعجبك إلى المفضلة من صفحة المنتج للوصول إليها لاحقًا.</p>
      <Link href="/products" className="btn-primary mt-8 inline-flex">استعرض المنتجات</Link>
    </main>
  );
}
