"use client";

import Image from "next/image";
import { HealthGauge } from "@/components/score/HealthGauge";
import { ScoreBreakdown } from "@/components/score/ScoreBreakdown";
import { useHealthScore } from "@/hooks/useHealthScore";
import { useShoppingList } from "@/hooks/useShoppingList";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

function NutritionRow({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-1.5 text-sm text-gray-600">{label}</td>
      <td className="py-1.5 text-sm text-right font-medium text-gray-800">
        {value !== null ? `${value}${unit}` : "—"}
      </td>
    </tr>
  );
}

const NOVA_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Unprocessed", color: "text-emerald-600 bg-emerald-50" },
  2: { label: "Culinary ingredients", color: "text-lime-600 bg-lime-50" },
  3: { label: "Processed", color: "text-yellow-600 bg-yellow-50" },
  4: { label: "Ultra-processed", color: "text-red-600 bg-red-50" },
};

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const healthScore = useHealthScore(product);
  const { addItem, removeItem, isInList } = useShoppingList();
  const inList = isInList(product.id);
  const nova = product.novaGroup ? NOVA_LABELS[product.novaGroup] : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>

        <button
          onClick={() => (inList ? removeItem(product.id) : addItem(product))}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition",
            inList
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
          )}
        >
          {inList ? "✓ In list" : "+ Add to list"}
        </button>
      </div>

      <div className="flex flex-col gap-6 p-4">
        {/* Product identity */}
        <div className="flex gap-4 items-start">
          <div className="relative h-24 w-24 flex-shrink-0 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="96px"
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-4xl" aria-hidden>🛒</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-xs text-gray-400">{product.brand}</p>
            <h2 className="text-base font-semibold text-gray-900 leading-snug">{product.name}</h2>
            {product.categories.length > 0 && (
              <p className="text-xs text-gray-400 truncate">{product.categories[0]}</p>
            )}
          </div>
        </div>

        {/* Score */}
        {healthScore && (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-gray-50 p-5">
            <HealthGauge score={healthScore.total} grade={healthScore.grade} size={140} />
            <ScoreBreakdown healthScore={healthScore} className="w-full" />
          </div>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          {product.nutriScore && (
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
              Nutri-Score <strong className="uppercase">{product.nutriScore}</strong>
            </span>
          )}
          {nova && (
            <span className={cn("rounded-full px-3 py-1 text-xs font-medium", nova.color)}>
              NOVA {product.novaGroup} · {nova.label}
            </span>
          )}
          {product.ecoScore && (
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
              Eco-Score <strong className="uppercase">{product.ecoScore}</strong>
            </span>
          )}
        </div>

        {/* Nutrition table */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Nutrition per 100g</h3>
          <table className="w-full">
            <tbody>
              <NutritionRow label="Calories" value={product.nutrition.calories} unit=" kcal" />
              <NutritionRow label="Carbohydrates" value={product.nutrition.carbohydrates} unit="g" />
              <NutritionRow label="  of which sugars" value={product.nutrition.sugar} unit="g" />
              <NutritionRow label="Fat" value={product.nutrition.fat} unit="g" />
              <NutritionRow label="  of which saturated" value={product.nutrition.saturatedFat} unit="g" />
              <NutritionRow label="Fibre" value={product.nutrition.fiber} unit="g" />
              <NutritionRow label="Protein" value={product.nutrition.protein} unit="g" />
              <NutritionRow label="Salt" value={product.nutrition.salt} unit="g" />
            </tbody>
          </table>
        </div>

        {/* Allergens */}
        {product.allergens.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Allergens</h3>
            <div className="flex flex-wrap gap-1.5">
              {product.allergens.map((a) => (
                <span key={a} className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-700 border border-orange-100">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Labels */}
        {product.labels.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Labels</h3>
            <div className="flex flex-wrap gap-1.5">
              {product.labels.map((l) => (
                <span key={l} className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 border border-emerald-100">
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {product.ingredients && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Ingredients</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{product.ingredients}</p>
          </div>
        )}
      </div>
    </div>
  );
}
