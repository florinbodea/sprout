"use client";

import { useProfile } from "@/context/ProfileContext";
import {
  Allergen,
  DietaryGoal,
  DietaryPreference,
} from "@/types";
import { cn } from "@/lib/utils";

// ─── Option definitions ───────────────────────────────────────────────────────

const GOALS: { value: DietaryGoal; label: string; icon: string }[] = [
  { value: "general-wellness", label: "General wellness", icon: "🌿" },
  { value: "weight-loss", label: "Weight loss", icon: "⚖️" },
  { value: "muscle-gain", label: "Muscle gain", icon: "💪" },
  { value: "heart-health", label: "Heart health", icon: "❤️" },
  { value: "diabetes-friendly", label: "Diabetes-friendly", icon: "🩺" },
];

const ALLERGENS: { value: Allergen; label: string }[] = [
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

const PREFERENCES: { value: DietaryPreference; label: string; icon: string }[] = [
  { value: "vegan", label: "Vegan", icon: "🌱" },
  { value: "vegetarian", label: "Vegetarian", icon: "🥦" },
  { value: "pescatarian", label: "Pescatarian", icon: "🐟" },
  { value: "keto", label: "Keto", icon: "🥑" },
  { value: "paleo", label: "Paleo", icon: "🍖" },
  { value: "halal", label: "Halal", icon: "☪️" },
  { value: "kosher", label: "Kosher", icon: "✡️" },
];

// ─── Chip component ───────────────────────────────────────────────────────────

function Chip({
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

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {description && (
          <p className="text-sm text-gray-400">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
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
            checked ? "translate-x-5.5 ml-0.5" : "translate-x-0.5"
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { profile, updateProfile, resetProfile } = useProfile();

  function toggle<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <div className="mx-auto max-w-xl px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-sm text-gray-400">
            Your selections personalise health scores across the whole app.
          </p>
        </div>

        {/* Goals */}
        <Section
          title="Health goals"
          description="Select all that apply — scores will be weighted accordingly."
        >
          <div className="flex flex-wrap gap-2">
            {GOALS.map(({ value, label, icon }) => (
              <Chip
                key={value}
                label={label}
                icon={icon}
                selected={profile.goals.includes(value)}
                onClick={() =>
                  updateProfile({ goals: toggle(profile.goals, value) })
                }
              />
            ))}
          </div>
        </Section>

        {/* Allergens */}
        <Section
          title="Allergens to avoid"
          description="Products containing these will show a warning."
        >
          <div className="flex flex-wrap gap-2">
            {ALLERGENS.map(({ value, label }) => (
              <Chip
                key={value}
                label={label}
                selected={profile.allergens.includes(value)}
                onClick={() =>
                  updateProfile({ allergens: toggle(profile.allergens, value) })
                }
              />
            ))}
          </div>
        </Section>

        {/* Preferences */}
        <Section
          title="Dietary preferences"
          description="Influences which products are highlighted as a good fit."
        >
          <div className="flex flex-wrap gap-2">
            {PREFERENCES.map(({ value, label, icon }) => (
              <Chip
                key={value}
                label={label}
                icon={icon}
                selected={profile.preferences.includes(value)}
                onClick={() =>
                  updateProfile({
                    preferences: toggle(profile.preferences, value),
                  })
                }
              />
            ))}
          </div>
        </Section>

        {/* Toggles */}
        <Section title="Extra preferences">
          <div className="space-y-3">
            <Toggle
              label="Avoid additives"
              description="Penalises ultra-processed (NOVA 4) products more heavily."
              checked={profile.avoidAdditives}
              onChange={(v) => updateProfile({ avoidAdditives: v })}
            />
            <Toggle
              label="Prefer organic"
              description="Boosts the score of organically labelled products."
              checked={profile.preferOrganic}
              onChange={(v) => updateProfile({ preferOrganic: v })}
            />
          </div>
        </Section>

        {/* Reset */}
        <button
          type="button"
          onClick={resetProfile}
          className="w-full rounded-2xl border border-red-200 py-3 text-sm font-medium text-red-400 hover:bg-red-50 transition"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
