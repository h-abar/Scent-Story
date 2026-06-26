import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { serializeProducts, serializeBanners } from "@/lib/serialize";
import { ArrowLeft, Star, Truck, Shield, Gift, Headphones, Instagram } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, string> = {
  oud: "🪵",
  perfumes: "🌸",
  oils: "💧",
  incense: "🔥",
  gifts: "🎁",
  accessories: "✨",
};

const FEATURES = [
  { icon: Truck, title: "شحن سريع", description: "توصيل لجميع مناطق المملكة" },
  { icon: Shield, title: "منتجات أصيلة", description: "جودة مضمونة 100%" },
  { icon: Gift, title: "تغليف فاخر", description: "مثالي للهدايا والمناسبات" },
  { icon: Headphones, title: "دعم عملاء", description: "متاح على مدار الساعة" },
];

const REVIEWS = [
  { name: "محمد العتيبي", text: "جودة العود الكمبودي لا تُضاهى. التغليف فاخر والتوصيل سريع جداً.", rating: 5 },
  { name: "سارة القحطاني", text: "أفضل متجر عطور شرقية اشتريت منه. دهن العود الملكي يستحق كل ريال.", rating: 5 },
  { name: "فهد المالكي", text: "خدمة ممتازة ومنتجات أصلية. طلبت هدايا للعيد والتغليف كان راقياً.", rating: 5 },
];

export default async function HomePage() {
  const [featuredProducts, bestSellers, newArrivals, categories, banners] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ isBestSeller: "desc" }, { views: "desc" }],
      take: 4,
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
    prisma.banner.findMany({
      where: { isActive: true, position: "home_hero" },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  const heroBanner = serializeBanners(banners)[0];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[90vh] overflow-hidden bg-cream-100">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={heroBanner?.image || "https://images.unsplash.com/photo-1607602132700-068258431c6c?w=1600&q=80"}
            alt="حكايا الطيب"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-warm-white via-warm-white/80 to-transparent" />
        </div>

        {/* Animated smoke overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/4 h-40 w-40 animate-smoke rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-32 w-32 animate-smoke rounded-full bg-brand-gold/20 blur-2xl [animation-delay:1s]" />
          <div className="absolute bottom-5 left-1/5 h-24 w-24 animate-smoke rounded-full bg-brand-brown/20 blur-2xl [animation-delay:2s]" />
        </div>

        <div className="container-page relative flex min-h-[90vh] items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-white/60 px-4 py-2 text-sm text-brand-brown">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              {heroBanner?.subtitle || "عود كمبودي فاخر — بصمة أصيلة من قلب الشرق"}
            </div>
            <h1 className="font-display text-5xl font-medium leading-[1.1] text-brand-brown-dark md:text-7xl">
              {heroBanner?.title || "حكاية طيب"}
              <br />
              <span className="text-brand-gold">بعبق الأصالة</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-oud-600">
              خيارات فاخرة من العود والبخور والعطور للحظات لا تُنسى. نختار لك أجود الأنواع بعناية لتروي قصتك العطرية.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={heroBanner?.link || "/products"} className="btn-primary px-8 py-4 text-base">
                تسوّق الآن
              </Link>
              <Link href="/about" className="btn-outline px-8 py-4 text-base">
                حكايتنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-b border-cream-300 bg-white">
        <div className="container-page py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream-100 text-brand-gold">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-brown-dark">{feature.title}</h3>
                  <p className="text-xs text-oud-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-20">
        <div className="mb-10 text-center">
          <h2 className="section-title">تسوّق حسب التصنيف</h2>
          <p className="section-subtitle">تصفّح مجموعاتنا الفاخرة المختارة بعناية</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat: { id: string; name: string; slug: string }) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-cream-300 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-card"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-100 text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-gold/10">
                {CATEGORY_ICONS[cat.slug] || "✨"}
              </div>
              <span className="font-medium text-brand-brown-dark group-hover:text-brand-gold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-cream-100 py-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="section-title">منتجات مميزة</h2>
              <p className="section-subtitle">اختيارنا الخاص لك من أجود المنتجات</p>
            </div>
            <Link href="/products" className="hidden items-center gap-1 text-sm font-medium text-brand-brown hover:text-brand-gold md:flex">
              عرض الكل <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {serializeProducts(featuredProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/products" className="btn-outline">عرض كل المنتجات</Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-page py-20">
        <div className="mb-10 text-center">
          <h2 className="section-title">الأكثر مبيعاً</h2>
          <p className="section-subtitle">المنتجات التي يفضلها عملاؤنا</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {serializeProducts(bestSellers).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Luxury banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=80"
            alt="هدية فاخرة"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-brown-dark/60" />
        </div>
        <div className="container-page relative py-24 text-center text-white">
          <span className="mb-4 inline-block rounded-full bg-brand-gold px-4 py-1 text-sm font-medium text-brand-brown-dark">
            تشكيلة خاصة
          </span>
          <h2 className="font-display text-4xl font-medium md:text-5xl">هدايا فاخرة</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream-200">
            لأنّ الهدايا تُحكى بالطيب، اكتشف صناديق الهدايا المنسّقة بأناقة لكل مناسبة.
          </p>
          <Link href="/products?category=gifts" className="btn-white mt-8 inline-flex">
            تسوّق الهدايا
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-cream-100 py-20">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="section-title">وصل حديثاً</h2>
            <p className="section-subtitle">استكشف أحدث الإضافات إلى مجموعتنا</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {serializeProducts(newArrivals).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container-page py-20">
        <div className="mb-10 text-center">
          <h2 className="section-title">آراء عملائنا</h2>
          <p className="section-subtitle">تجارب حقيقية من عشاق العود والعطور</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="mb-4 flex justify-center gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-brand-brown">&ldquo;{review.text}&rdquo;</p>
              <p className="text-sm font-medium text-brand-gold">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram feed placeholder */}
      <section className="bg-cream-100 py-20">
        <div className="container-page text-center">
          <h2 className="section-title">@hakaya.altayib</h2>
          <p className="section-subtitle">تابعنا على إنستغرام للمزيد من الإلهام</p>
          <div className="mt-8 grid grid-cols-3 gap-2 md:grid-cols-6">
            {featuredProducts.slice(0, 6).map((product: { id: string; images: string[] }, i: number) => (
              <a
                key={i}
                href="https://instagram.com/hakaya.altayib"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl bg-oud-200"
              >
                <Image
                  src={product.images[0] || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80"}
                  alt="Instagram"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-brand-brown-dark/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
