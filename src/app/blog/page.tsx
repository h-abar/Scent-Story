import Link from "next/link";

export const metadata = { title: "المدونة" };

export default function BlogPage() {
  return (
    <main className="container-page py-20 text-center">
      <h1 className="section-title">المدونة</h1>
      <p className="section-subtitle mx-auto mt-4 max-w-xl">نشارككم قريبًا قصص العطور والعود ونصائح اختيار العطر المناسب.</p>
      <Link href="/products" className="btn-primary mt-8 inline-flex">تسوّق المنتجات</Link>
    </main>
  );
}
