"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Settings, LogOut, Store, ShoppingBag, Grid3X3, Image, Users, Receipt, Phone, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: Package },
  { href: "/admin/products", label: "المنتجات", icon: ShoppingBag },
  { href: "/admin/categories", label: "التصنيفات", icon: Grid3X3 },
  { href: "/admin/banners", label: "البنرات", icon: Image },
  { href: "/admin/customers", label: "العملاء", icon: Users },
  { href: "/admin/receipts", label: "الإيصالات", icon: Receipt },
  { href: "/admin/whatsapp-orders", label: "طلبات الواتساب", icon: Phone },
  { href: "/admin/activity", label: "السجل", icon: ScrollText },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/admin/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-cream-300 bg-warm-white">
      <div className="container-page flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-semibold text-brand-gold">
            حكايا الطيب — الإدارة
          </Link>
          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "bg-cream-100 text-brand-gold" : "text-brand-brown hover:bg-cream-100"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-oud-500 hover:text-brand-gold">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">عرض المتجر</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>

      {/* قائمة الجوال */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-cream-300 px-4 py-2 xl:hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                active ? "bg-cream-100 text-brand-gold" : "text-brand-brown"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
