import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-50">
      <AdminNav />
      <div className="no-print">{children}</div>
    </div>
  );
}
