export const metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPage() {
  return (
    <main className="container-page max-w-3xl py-16">
      <h1 className="section-title">سياسة الخصوصية</h1>
      <div className="mt-8 space-y-5 leading-8 text-oud-600">
        <p>نحترم خصوصيتك ونستخدم بياناتك فقط لمعالجة الطلبات والتواصل بشأنها وتحسين تجربتك في المتجر.</p>
        <p>لا نبيع بيانات العملاء أو نشاركها مع جهات غير مرتبطة بتقديم خدمات الطلب والتوصيل.</p>
        <p>للاستفسارات المتعلقة ببياناتك، تواصل معنا عبر صفحة التواصل.</p>
      </div>
    </main>
  );
}
