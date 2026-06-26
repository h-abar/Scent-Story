"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-brand-brown-dark/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 z-50 h-full w-full max-w-md bg-warm-white shadow-2xl animate-fade-in">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-brown-dark">
              <ShoppingBag className="h-5 w-5 text-brand-gold" />
              سلة التسوق ({totalItems})
            </h2>
            <button onClick={closeCart} className="rounded-full p-2 text-oud-500 hover:bg-cream-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-100 text-oud-300">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <div>
                  <p className="font-medium text-brand-brown-dark">سلتك فارغة</p>
                  <p className="text-sm text-oud-500">ابدأ التسوق واكتشف منتجاتنا الفاخرة</p>
                </div>
                <Link href="/products" onClick={closeCart} className="btn-outline text-sm">
                  تصفح المنتجات
                </Link>
              </div>
            ) : (
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-cream-100">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-sm font-medium text-brand-brown-dark hover:text-brand-gold"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-oud-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-cream-300 bg-cream-100 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-brand-brown hover:bg-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-brand-brown hover:bg-white disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-brand-gold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-cream-300 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-oud-600">المجموع الفرعي</span>
                <span className="text-xl font-semibold text-brand-brown-dark">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-oud-500">سيتم احتساب رسوم الشحن والضريبة عند الدفع</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full gap-2"
              >
                إتمام الطلب <ArrowLeft className="h-4 w-4" />
              </Link>
              <button
                onClick={closeCart}
                className="btn-ghost w-full text-sm"
              >
                مواصلة التسوق
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
