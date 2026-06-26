import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ProductDetailActions } from "@/components/storefront/product-detail-actions";
import { ProductCard } from "@/components/storefront/product-card";
import { serializeProduct, serializeProducts } from "@/lib/serialize";
import { ChevronLeft, ShoppingBag, Check, Truck, Shield, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: "المنتج غير موجود" };
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: { images: product.images[0] ? [{ url: product.images[0] }] : [] },
  };
}

const TRUST_BADGES = [
  { icon: Truck, text: "شحن سريع" },
  { icon: Shield, text: "جودة مضمونة" },
  { icon: RefreshCw, text: "استرجاع سهل" },
];

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product || !product.isActive) notFound();

  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
  });

  const hasDiscount =
    product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : null;

  return (
    <div className="bg-cream-50">
      {/* Breadcrumb */}
      <div className="border-b border-cream-300 bg-warm-white">
        <div className="container-page py-4">
          <nav className="flex items-center gap-2 text-sm text-oud-500">
            <Link href="/" className="hover:text-brand-gold">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href="/products" className="hover:text-brand-gold">المتجر</Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-gold">
              {product.category.name}
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-brand-brown-dark">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream-100 shadow-soft">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-oud-300">
                  <ShoppingBag className="h-24 w-24" />
                </div>
              )}
              {discountPercent && (
                <span className="absolute right-4 top-4 rounded-full bg-brand-brown px-4 py-1.5 text-sm font-medium text-white shadow-soft">
                  وفر {discountPercent}%
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-cream-100">
                    <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="mb-2 text-sm font-medium text-brand-gold">{product.category.name}</span>
            <h1 className="font-display text-3xl font-medium text-brand-brown-dark lg:text-4xl">{product.name}</h1>

            <div className="mb-6 mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-brand-gold">{formatPrice(Number(product.price))}</span>
              {hasDiscount && (
                <span className="text-lg text-oud-400 line-through">
                  {formatPrice(Number(product.compareAtPrice))}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mb-6 leading-relaxed text-oud-600">{product.description}</p>
            )}

            <div className="mb-6 flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  <Check className="h-4 w-4" />
                  متوفر في المخزون ({product.stock} قطعة)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-red-700">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  نفد المخزون
                </span>
              )}
            </div>

            <ProductDetailActions product={serializeProduct(product)} />

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-cream-300 bg-white p-4">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.text} className="text-center">
                  <badge.icon className="mx-auto h-5 w-5 text-brand-gold" />
                  <p className="mt-1 text-xs text-oud-600">{badge.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 rounded-2xl border border-cream-300 bg-white p-6 lg:p-8">
          <div className="mb-6 border-b border-cream-300 pb-4">
            <h3 className="font-display text-xl font-medium text-brand-brown-dark">تفاصيل المنتج</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-brand-brown-dark">الوصف</h4>
              <p className="text-sm leading-relaxed text-oud-600">
                {product.description || "منتج فاخر من مجموعة حكايا الطيب، يتميز بجودة عالية وثبات رائحة ممتاز."}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-brand-brown-dark">المعلومات</h4>
              <ul className="space-y-2 text-sm text-oud-600">
                <li className="flex justify-between border-b border-cream-200 pb-2">
                  <span>الفئة</span>
                  <span className="font-medium text-brand-brown-dark">{product.category.name}</span>
                </li>
                <li className="flex justify-between border-b border-cream-200 pb-2">
                  <span>المخزون</span>
                  <span className="font-medium text-brand-brown-dark">{product.stock} قطعة</span>
                </li>
                <li className="flex justify-between border-b border-cream-200 pb-2">
                  <span>طريقة الدفع</span>
                  <span className="font-medium text-brand-brown-dark">تحويل بنكي / واتساب</span>
                </li>
                <li className="flex justify-between border-b border-cream-200 pb-2">
                  <span>الشحن</span>
                  <span className="font-medium text-brand-brown-dark">2-5 أيام عمل</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 text-center">
              <h2 className="section-title">منتجات ذات صلة</h2>
              <p className="section-subtitle">قد يعجبك أيضاً</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {serializeProducts(related).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
