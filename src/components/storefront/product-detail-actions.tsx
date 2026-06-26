"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus, Heart, Share2 } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProductDetailActionsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number | string | { toString(): string };
    images: string[];
    stock: number;
  };
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;
  const priceNum = Number(product.price);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: priceNum,
        image: product.images[0] ?? "",
        stock: product.stock,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: priceNum,
        image: product.images[0] ?? "",
        stock: product.stock,
      },
      quantity
    );
    router.push("/checkout");
  };

  return (
    <div className="space-y-5">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-brand-brown">الكمية</span>
        <div className="flex items-center rounded-full border border-cream-300 bg-cream-100 p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-brown transition-colors hover:bg-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-base font-semibold text-brand-brown-dark">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-brown transition-colors hover:bg-white disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between rounded-2xl bg-cream-100 px-5 py-4">
        <span className="text-sm text-oud-600">الإجمالي</span>
        <span className="text-2xl font-semibold text-brand-gold">
          {formatPrice(priceNum * quantity)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="btn-primary flex-1 gap-2 text-base"
        >
          <ShoppingBag className="h-5 w-5" />
          {outOfStock ? "نفد المخزون" : "أضف إلى السلة"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="btn-secondary flex-1 text-base"
        >
          اشترِ الآن
        </button>
      </div>

      {/* Secondary actions */}
      <div className="flex items-center gap-4 pt-2">
        <button className="flex items-center gap-2 text-sm text-oud-500 hover:text-brand-gold transition-colors">
          <Heart className="h-4 w-4" /> المفضلة
        </button>
        <button
          onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
          className="flex items-center gap-2 text-sm text-oud-500 hover:text-brand-gold transition-colors"
        >
          <Share2 className="h-4 w-4" /> مشاركة
        </button>
      </div>
    </div>
  );
}
