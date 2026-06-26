"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  query?: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: الأقل أولاً" },
  { value: "price-desc", label: "السعر: الأعلى أولاً" },
  { value: "name", label: "الاسم" },
];

export function ProductFilters({ categories, currentCategory, currentSort, query }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1 text-sm font-medium text-oud-500 lg:flex">
            <SlidersHorizontal className="h-4 w-4" /> التصنيف:
          </span>
          <button
            onClick={() => updateParam("category", "")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              !currentCategory
                ? "bg-brand-brown text-white shadow-soft"
                : "bg-cream-100 text-brand-brown hover:bg-cream-200"
            )}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.slug)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                currentCategory === cat.slug
                  ? "bg-brand-brown text-white shadow-soft"
                  : "bg-cream-100 text-brand-brown hover:bg-cream-200"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-oud-400" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              defaultValue={query}
              onChange={(e) => updateParam("q", e.target.value)}
              className="w-full rounded-full border border-cream-300 bg-cream-100 py-2 pr-9 pl-4 text-sm text-brand-brown-dark placeholder:text-oud-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
            />
            {query && (
              <button
                onClick={() => updateParam("q", "")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-oud-400 hover:text-brand-brown"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={currentSort || "newest"}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="rounded-full border border-cream-300 bg-cream-100 px-4 py-2 text-sm text-brand-brown-dark focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
