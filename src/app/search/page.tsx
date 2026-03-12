"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { ProductCard } from "@/components/search/ProductCard";
import { ProductDetail } from "@/components/search/ProductDetail";
import { useSearch } from "@/hooks/useSearch";
import { Product } from "@/types";

export default function SearchPage() {
  const { query, setQuery, results, total, isLoading, error, page, setPage } =
    useSearch();
  const [selected, setSelected] = useState<Product | null>(null);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left panel — search + results */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
          selected ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Search bar */}
        <div className="px-4 pt-6 pb-3 bg-gray-50 sticky top-0 z-10 shadow-sm">
          <SearchBar
            value={query}
            onChange={setQuery}
            isLoading={isLoading}
          />
          {!isLoading && query && (
            <p className="mt-2 text-xs text-gray-400 px-1">
              {total > 0
                ? `${total.toLocaleString()} result${total !== 1 ? "s" : ""}`
                : "No results"}
            </p>
          )}
        </div>

        {/* Results grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {error ? (
            <div className="mt-12 flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">😕</span>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : !query ? (
            <div className="mt-16 flex flex-col items-center gap-2 text-center px-6">
              <span className="text-5xl">🌿</span>
              <p className="text-base font-semibold text-gray-700">
                Search any grocery product
              </p>
              <p className="text-sm text-gray-400">
                Get instant health scores powered by Open Food Facts
              </p>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="mt-12 flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">🔍</span>
              <p className="text-sm text-gray-500">
                No products found for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelected(product)}
                    className={
                      selected?.id === product.id
                        ? "ring-2 ring-emerald-400"
                        : ""
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="rounded-lg px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Prev
                  </button>
                  <span className="text-sm text-gray-500">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="rounded-lg px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right panel — product detail (desktop side-by-side, mobile full-screen) */}
      {selected && (
        <div className="w-full md:w-96 lg:w-[420px] flex-shrink-0 border-l border-gray-200 bg-white overflow-hidden">
          <ProductDetail
            product={selected}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  );
}
