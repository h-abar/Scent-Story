"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, Search, Heart, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { cn } from "@/lib/utils";

const SHOP_LINKS = [
  { href: "/products?category=oud", label: "العود" },
  { href: "/products?category=perfumes", label: "العطور" },
  { href: "/products?category=incense", label: "البخور" },
  { href: "/products?category=gifts", label: "هدايا" },
  { href: "/products?category=accessories", label: "إكسسوارات" },
  { href: "/offers", label: "العروض" },
];

const MAIN_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المتجر" },
  { href: "/about", label: "حكايتنا" },
  { href: "/blog", label: "المدونة" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopOpen, setShopOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cream-300 bg-warm-white/95 backdrop-blur-md">
      {/* Top bar */}
      <div className="bg-brand-brown text-center text-xs text-cream-100 py-2 px-4">
        شحن مجاني للطلبات فوق 500 ريال | دفع آمن بالتحويل البنكي
      </div>

      <div className="container-page">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-3 shrink-0">
            <Image
              src="/logo.png"
              alt="حكايا الطيب"
              width={56}
              height={56}
              className="h-12 w-auto object-contain"
              priority
            />
            <span className="hidden font-display text-2xl font-medium text-brand-brown-dark lg:block">
              حكايا الطيب
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {MAIN_LINKS.map((link) =>
              link.href === "/products" ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-brand-gold",
                      pathname === link.href || pathname.startsWith("/products") ? "text-brand-gold" : "text-brand-brown"
                    )}
                  >
                    {link.label}
                  </Link>
                  {shopOpen && (
                    <div className="absolute right-0 top-full z-40 mt-1 w-48 rounded-xl border border-cream-300 bg-white py-2 shadow-card animate-fade-in">
                      {SHOP_LINKS.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="block px-4 py-2 text-sm text-brand-brown hover:bg-cream-100 hover:text-brand-gold"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-brand-gold",
                    pathname === link.href ? "text-brand-gold" : "text-brand-brown"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={cn("hidden items-center md:flex", searchOpen ? "flex" : "")}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن عود، عطر، بخور..."
                  className="h-10 w-48 rounded-full border border-cream-300 bg-cream-100 pl-10 pr-4 text-sm text-brand-brown-dark placeholder:text-oud-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 lg:w-64"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-oud-400 hover:text-brand-gold">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>
            <button
              className="rounded-full p-2.5 text-brand-brown hover:bg-cream-100 md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="بحث"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              className="hidden rounded-full p-2.5 text-brand-brown hover:bg-cream-100 md:flex"
              aria-label="المفضلة"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/account"
              className="hidden rounded-full p-2.5 text-brand-brown hover:bg-cream-100 md:flex"
              aria-label="حسابي"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={openCart}
              className="relative rounded-full p-2.5 text-brand-brown hover:bg-cream-100"
              aria-label="السلة"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-xs font-bold text-brand-brown-dark">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full p-2.5 text-brand-brown hover:bg-cream-100 lg:hidden"
              aria-label="القائمة"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-cream-300 bg-warm-white lg:hidden">
          <nav className="container-page py-4">
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block py-3 text-base font-medium border-b border-cream-200",
                  pathname === link.href ? "text-brand-gold" : "text-brand-brown"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex gap-4">
              <Link href="/wishlist" className="flex items-center gap-2 text-sm text-brand-brown hover:text-brand-gold">
                <Heart className="h-4 w-4" /> المفضلة
              </Link>
              <Link href="/account" className="flex items-center gap-2 text-sm text-brand-brown hover:text-brand-gold">
                <User className="h-4 w-4" /> حسابي
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
