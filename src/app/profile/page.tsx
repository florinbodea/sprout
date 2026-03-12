"use client";

import { useRouter } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";
import {
  Allergen,
  DietaryGoal,
  DietaryPreference,
} from "@/types";
import { cn } from "@/lib/utils";
import { GOALS, ALLERGENS, PREFERENCES, Chip, Toggle } from "@/lib/profileOptions";

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { profile, updateProfile, resetProfile } = useProfile();
  const { user } = useAuth();
  const router = useRouter();

  function toggle<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  const memberSince = user?.registeredAt
    ? new Date(user.registeredAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

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

        {/* Identity card */}
        {user && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-lg font-bold text-emerald-700 flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
              {memberSince && (
                <p className="text-xs text-gray-300 mt-0.5">Member since {memberSince}</p>
              )}
            </div>
          </div>
        )}

        {/* Re-run onboarding */}
        <button
          type="button"
          onClick={() => router.push("/onboarding?from=profile")}
          className="w-full rounded-2xl border border-emerald-200 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition"
        >
          Re-run setup wizard →
        </button>

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
                selected={profile.goals.includes(value as DietaryGoal)}
                onClick={() =>
                  updateProfile({ goals: toggle(profile.goals, value as DietaryGoal) })
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
                selected={profile.allergens.includes(value as Allergen)}
                onClick={() =>
                  updateProfile({ allergens: toggle(profile.allergens, value as Allergen) })
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
                selected={profile.preferences.includes(value as DietaryPreference)}
                onClick={() =>
                  updateProfile({
                    preferences: toggle(profile.preferences, value as DietaryPreference),
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
