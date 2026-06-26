"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number | string | { toString(): string };
    compareAtPrice?: number | string | { toString(): string } | null;
    images: string[];
    stock: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const priceNum = Number(product.price);
  const compareNum = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const hasDiscount = compareNum !== null && compareNum > priceNum;
  const outOfStock = product.stock <= 0;

  return (
    <div className="group card card-hover overflow-hidden rounded-2xl border-cream-300 bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-oud-400">
              <ShoppingBag className="h-12 w-12" />
            </div>
          )}
        </Link>

        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-brown px-3 py-1 text-xs font-medium text-white shadow-soft">
            خصم
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-brown-dark/50 backdrop-blur-sm">
            <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-brown-dark">نفد المخزون</span>
          </div>
        )}

        <button
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-brown shadow-sm opacity-0 transition-all duration-300 hover:bg-brand-gold hover:text-brand-brown-dark group-hover:opacity-100"
          aria-label="إضافة إلى المفضلة"
        >
          <Heart className="h-4 w-4" />
        </button>

        <button
          onClick={() =>
            !outOfStock &&
            addItem({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: priceNum,
              image: product.images[0] ?? "",
              stock: product.stock,
            })
          }
          disabled={outOfStock}
          className="absolute bottom-0 left-0 right-0 translate-y-full bg-brand-gold py-3 text-sm font-medium text-brand-brown-dark transition-transform duration-300 hover:bg-brand-gold-dark group-hover:translate-y-0 disabled:translate-y-full"
        >
          أضف إلى السلة
        </button>
      </div>

      <div className="p-4 text-center">
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-1 text-base font-medium text-brand-brown-dark transition-colors hover:text-brand-gold">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-semibold text-brand-gold">{formatPrice(priceNum)}</span>
          {hasDiscount && (
            <span className="text-sm text-oud-400 line-through">{formatPrice(compareNum!)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
