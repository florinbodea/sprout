"use client";

import Image from "next/image";
import { GradeBadge } from "@/components/score/GradeBadge";
import { useHealthScore } from "@/hooks/useHealthScore";
import { useShoppingList } from "@/hooks/useShoppingList";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

export function ProductCard({ product, onClick, className }: ProductCardProps) {
  const healthScore = useHealthScore(product);
  const { addItem, removeItem, isInList } = useShoppingList();
  const inList = isInList(product.id);

  const handleListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    inList ? removeItem(product.id) : addItem(product);
  };

  return (
    <article
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden",
        className
      )}
    >
      {/* Product image */}
      <div className="relative h-40 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-contain p-3 transition-transform group-hover:scale-105"
            unoptimized // OFF CDN varies; skip Next.js image optimisation
          />
        ) : (
          <span className="text-5xl select-none" aria-hidden>🛒</span>
        )}

        {/* Grade badge overlay */}
        {healthScore && (
          <div className="absolute top-2 left-2">
            <GradeBadge grade={healthScore.grade} size="sm" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-1 p-3">
        <p className="text-xs text-gray-400 truncate">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {healthScore && (
          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Score{" "}
              <span className="font-bold text-gray-800">{healthScore.total}</span>
              <span className="text-gray-400">/100</span>
            </span>

            {/* Warning count */}
            {healthScore.warnings.length > 0 && (
              <span className="text-xs text-orange-500">
                ⚠️ {healthScore.warnings.length}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Add / remove list button */}
      <button
        type="button"
        onClick={handleListToggle}
        aria-label={inList ? "Remove from shopping list" : "Add to shopping list"}
        className={cn(
          "absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-sm shadow transition",
          inList
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
        )}
      >
        {inList ? "✓" : "+"}
      </button>
    </article>
  );
}
