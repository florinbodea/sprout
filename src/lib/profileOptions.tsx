"use client";

import { Allergen, DietaryGoal, DietaryPreference } from "@/types";
import { cn } from "@/lib/utils";

// ─── Shared option arrays ─────────────────────────────────────────────────────
// Used by both the profile page and the onboarding wizard.

export const GOALS: { value: DietaryGoal; label: string; icon: string }[] = [
  { value: "general-wellness", label: "General wellness", icon: "🌿" },
  { value: "weight-loss", label: "Weight loss", icon: "⚖️" },
  { value: "muscle-gain", label: "Muscle gain", icon: "💪" },
  { value: "heart-health", label: "Heart health", icon: "❤️" },
  { value: "diabetes-friendly", label: "Diabetes-friendly", icon: "🩺" },
];

export const ALLERGENS: { value: Allergen; label: string }[] = [
  { value: "gluten", label: "Gluten" },
  { value: "dairy", label: "Dairy" },
  { value: "eggs", label: "Eggs" },
  { value: "nuts", label: "Nuts" },
  { value: "peanuts", label: "Peanuts" },
  { value: "soy", label: "Soy" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "sesame", label: "Sesame" },
];

export const PREFERENCES: { value: DietaryPreference; label: string; icon: string }[] = [
  { value: "vegan", label: "Vegan", icon: "🌱" },
  { value: "vegetarian", label: "Vegetarian", icon: "🥦" },
  { value: "pescatarian", label: "Pescatarian", icon: "🐟" },
  { value: "keto", label: "Keto", icon: "🥑" },
  { value: "paleo", label: "Paleo", icon: "🍖" },
  { value: "halal", label: "Halal", icon: "☪️" },
  { value: "kosher", label: "Kosher", icon: "✡️" },
];

// ─── Shared UI primitives ─────────────────────────────────────────────────────
// These are tiny enough to live here alongside the data they style.

export function Chip({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition select-none",
        selected
          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {label}
      {selected && <span className="ml-0.5 text-emerald-500" aria-hidden>✓</span>}
    </button>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 cursor-pointer hover:bg-gray-50 transition">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-emerald-500" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5",
            checked ? "translate-x-5 ml-0.5" : "translate-x-0.5"
          )}
        />
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    </label>
  );
}
