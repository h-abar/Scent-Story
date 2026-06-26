"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Instagram, Twitter, Mail, ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

const FOOTER_LINKS = {
  shop: [
    { href: "/products?category=oud", label: "العود" },
    { href: "/products?category=perfumes", label: "العطور" },
    { href: "/products?category=incense", label: "البخور" },
    { href: "/products?category=gifts", label: "صناديق الهدايا" },
    { href: "/offers", label: "العروض" },
  ],
  company: [
    { href: "/about", label: "حكايتنا" },
    { href: "/blog", label: "المدونة" },
    { href: "/contact", label: "تواصل معنا" },
    { href: "/track-order", label: "تتبع الطلب" },
  ],
  support: [
    { href: "/shipping", label: "الشحن والتوصيل" },
    { href: "/returns", label: "سياسة الإرجاع" },
    { href: "/faq", label: "الأسئلة الشائعة" },
    { href: "/privacy", label: "سياسة الخصوصية" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="mt-24 bg-brand-brown-dark text-cream-100">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-page py-12">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="text-center lg:text-right">
              <h3 className="font-display text-2xl font-medium text-brand-gold">انضم إلى نشرتنا الإخبارية</h3>
              <p className="mt-2 text-sm text-cream-200">احصل على أحدث المنتجات والعروض الحصرية مباشرة إلى بريدك.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-cream-300 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              />
              <button type="submit" className="btn-primary gap-2 whitespace-nowrap">
                {subscribed ? "تم التسجيل" : "اشترك"} <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="حكايا الطيب" width={60} height={60} className="h-14 w-auto" />
              <span className="font-display text-2xl font-medium text-brand-gold">حكايا الطيب</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-200">
              وجهتك الفاخرة للعود والعطور الأصيلة. نختار لك أجود أنواع العود الكمبودي والهندي،
              دهن العود الملكي، العطور الفرنسية، والبخور العربي بعناية فائقة.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" className="rounded-full border border-white/20 p-2.5 text-cream-200 hover:border-brand-gold hover:text-brand-gold">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full border border-white/20 p-2.5 text-cream-200 hover:border-brand-gold hover:text-brand-gold">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full border border-white/20 p-2.5 text-cream-200 hover:border-brand-gold hover:text-brand-gold">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-5 text-sm font-semibold text-brand-gold">المتجر</h4>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream-200 hover:text-brand-gold flex items-center gap-1 group">
                    <ArrowLeft className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-5 text-sm font-semibold text-brand-gold">الشركة</h4>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream-200 hover:text-brand-gold flex items-center gap-1 group">
                    <ArrowLeft className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-sm font-semibold text-brand-gold">تواصل معنا</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-cream-200">
                <Phone className="mt-0.5 h-4 w-4 text-brand-gold" />
                <span dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-start gap-3 text-cream-200">
                <Mail className="mt-0.5 h-4 w-4 text-brand-gold" />
                <span>info@hakaya-altayib.com</span>
              </li>
              <li className="flex items-start gap-3 text-cream-200">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-gold" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-cream-300 md:flex-row">
          <p>© {new Date().getFullYear()} حكايا الطيب. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-gold">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-brand-gold">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
