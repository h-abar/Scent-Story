import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "سجل النشاطات",
};

export default async function AdminActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-brown-dark">سجل النشاطات</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-right text-xs text-oud-500">
              <tr>
                <th className="px-4 py-3 font-medium">النشاط</th>
                <th className="px-4 py-3 font-medium">الكيان</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {logs.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-oud-400">لا توجد سجلات</td></tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-cream-50/50">
                    <td className="px-4 py-3 font-medium text-brand-brown-dark">{log.action}</td>
                    <td className="px-4 py-3 text-oud-600">{log.entity} {log.entityId ? `(${log.entityId})` : ""}</td>
                    <td className="px-4 py-3 text-oud-600" dir="ltr">{log.ipAddress || "—"}</td>
                    <td className="px-4 py-3 text-xs text-oud-500">{new Date(log.createdAt).toLocaleString("ar-SA")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
