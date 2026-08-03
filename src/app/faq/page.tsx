export const metadata = { title: "الأسئلة الشائعة" };

export default function FaqPage() {
  return (
    <main className="container-page max-w-3xl py-16">
      <h1 className="section-title">الأسئلة الشائعة</h1>
      <div className="mt-8 space-y-5 leading-8 text-oud-600">
        <p><strong>كيف أتابع طلبي؟</strong><br />استخدم صفحة تتبع الطلب وأدخل رقم الطلب ورقم الجوال.</p>
        <p><strong>كيف أتواصل مع المتجر؟</strong><br />يمكنك استخدام صفحة تواصل معنا أو التواصل عبر واتساب.</p>
      </div>
    </main>
  );
}
