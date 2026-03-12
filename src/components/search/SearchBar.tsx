"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  isLoading = false,
  placeholder = "Search for a product, brand or ingredient…",
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "relative flex items-center w-full rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition",
        className
      )}
    >
      {/* Search icon / spinner */}
      <span className="pl-4 pr-2 flex-shrink-0 text-gray-400">
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )}
      </span>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="flex-1 bg-transparent py-3 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="pr-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
