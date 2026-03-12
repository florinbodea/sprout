"use client";

import { useState } from "react";
import Image from "next/image";
import { GradeBadge } from "@/components/score/GradeBadge";
import { ProductDetail } from "@/components/search/ProductDetail";
import { useShoppingList } from "@/hooks/useShoppingList";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

export default function ShoppingListPage() {
  const {
    items,
    removeItem,
    toggleChecked,
    updateQuantity,
    clearList,
  } = useShoppingList();

  const [selected, setSelected] = useState<Product | null>(null);

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);
  const avgScore =
    items.length > 0
      ? Math.round(items.reduce((s, i) => s + i.score.total, 0) / items.length)
      : null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* List panel */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0",
          selected ? "hidden md:flex" : "flex"
        )}
      >
        {/* Header */}
        <div className="px-4 pt-6 pb-3 bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Shopping List</h1>
              {avgScore !== null && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {items.length} item{items.length !== 1 ? "s" : ""} · avg score{" "}
                  <span className="font-semibold text-gray-700">{avgScore}</span>
                </p>
              )}
            </div>
            {items.length > 0 && (
              <button
                onClick={clearList}
                className="text-xs text-red-400 hover:text-red-600 transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6">
            <span className="text-5xl">🛒</span>
            <p className="text-base font-semibold text-gray-700">Your list is empty</p>
            <p className="text-sm text-gray-400">
              Search for products and tap <strong>+</strong> to add them here.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 pb-24 md:pb-6 space-y-6 pt-4">
            {/* Unchecked items */}
            {unchecked.length > 0 && (
              <ul className="space-y-2">
                {unchecked.map((item) => (
                  <ListItem
                    key={item.product.id}
                    item={item}
                    onToggle={() => toggleChecked(item.product.id)}
                    onRemove={() => removeItem(item.product.id)}
                    onQuantityChange={(q) => updateQuantity(item.product.id, q)}
                    onClick={() => setSelected(item.product)}
                    isSelected={selected?.id === item.product.id}
                  />
                ))}
              </ul>
            )}

            {/* Checked items */}
            {checked.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
                  Done ({checked.length})
                </p>
                <ul className="space-y-2 opacity-60">
                  {checked.map((item) => (
                    <ListItem
                      key={item.product.id}
                      item={item}
                      onToggle={() => toggleChecked(item.product.id)}
                      onRemove={() => removeItem(item.product.id)}
                      onQuantityChange={(q) => updateQuantity(item.product.id, q)}
                      onClick={() => setSelected(item.product)}
                      isSelected={selected?.id === item.product.id}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-full md:w-96 lg:w-[420px] flex-shrink-0 border-l border-gray-200 bg-white overflow-hidden">
          <ProductDetail product={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}

// ─── List item row ────────────────────────────────────────────────────────────

interface ListItemProps {
  item: ReturnType<typeof useShoppingList>["items"][number];
  onToggle: () => void;
  onRemove: () => void;
  onQuantityChange: (q: number) => void;
  onClick: () => void;
  isSelected: boolean;
}

function ListItem({
  item,
  onToggle,
  onRemove,
  onQuantityChange,
  onClick,
  isSelected,
}: ListItemProps) {
  const { product, score, quantity, checked } = item;

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-white border p-3 transition",
        isSelected ? "border-emerald-400 shadow-sm" : "border-gray-100",
        checked && "line-through"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={checked ? "Mark as not done" : "Mark as done"}
        className={cn(
          "flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition",
          checked
            ? "border-emerald-400 bg-emerald-400 text-white"
            : "border-gray-300 hover:border-emerald-400"
        )}
      >
        {checked && (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden>
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Image */}
      <button
        onClick={onClick}
        className="relative h-12 w-12 flex-shrink-0 rounded-xl bg-gray-50 overflow-hidden border border-gray-100"
        aria-label={`View ${product.name}`}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="48px"
            className="object-contain p-1"
            unoptimized
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xl" aria-hidden>🛒</span>
        )}
      </button>

      {/* Name + score */}
      <button
        onClick={onClick}
        className="flex-1 min-w-0 text-left"
      >
        <p className="text-xs text-gray-400 truncate">{product.brand}</p>
        <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <GradeBadge grade={score.grade} size="sm" />
          <span className="text-xs text-gray-400">{score.total}/100</span>
        </div>
      </button>

      {/* Quantity */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="h-6 w-6 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40 text-sm flex items-center justify-center transition"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-medium text-gray-700">
          {quantity}
        </span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="h-6 w-6 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-sm flex items-center justify-center transition"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        aria-label="Remove from list"
        className="flex-shrink-0 text-gray-300 hover:text-red-400 transition"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
}
