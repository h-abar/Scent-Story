export const metadata = { title: "شروط الاستخدام" };

export default function TermsPage() {
  return (
    <main className="container-page max-w-3xl py-16">
      <h1 className="section-title">شروط الاستخدام</h1>
      <div className="mt-8 space-y-5 leading-8 text-oud-600">
        <p>باستخدامك للمتجر، فإنك توافق على تقديم بيانات صحيحة لإتمام الطلب والتواصل معك.</p>
        <p>تخضع الأسعار والتوفر للتحديث، وقد تتغير حالة المنتج قبل تأكيد الطلب.</p>
        <p>لأي استفسار أو طلب مساعدة، يرجى التواصل مع فريق خدمة العملاء.</p>
      </div>
    </main>
  );
}
