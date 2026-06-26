import { prisma } from "@/lib/prisma";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const waNumber = settings?.whatsappNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="mb-8 font-display text-3xl text-oud-900">تواصل معنا</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* معلومات التواصل */}
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-oud-900">معلومات التواصل</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-oud-900">الهاتف</div>
                <div className="text-sm text-oud-500" dir="ltr">+966 50 000 0000</div>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-oud-900">واتساب</div>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline"
                >
                  تواصل عبر واتساب
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-oud-50 text-oud-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-oud-900">ساعات العمل</div>
                <div className="text-sm text-oud-500">السبت - الخميس: 9ص - 11م</div>
              </div>
            </li>
          </ul>
        </div>

        {/* الفروع */}
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-oud-900">فروعنا</h2>
          <ul className="space-y-4">
            {branches.map((branch) => (
              <li key={branch.id} className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-oud-900">{branch.name}</div>
                  {branch.address && <div className="text-sm text-oud-500">{branch.address}</div>}
                  {branch.phone && <div className="text-sm text-oud-500" dir="ltr">{branch.phone}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
