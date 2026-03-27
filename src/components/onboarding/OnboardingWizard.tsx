"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import { StepGoals } from "./steps/StepGoals";
import { StepAllergens } from "./steps/StepAllergens";
import { StepPreferences } from "./steps/StepPreferences";
import { StepExtras } from "./steps/StepExtras";

const TOTAL_STEPS = 4;

const STEP_LABELS = [
  "Health goals",
  "Allergens",
  "Preferences",
  "Fine-tuning",
];

interface OnboardingWizardProps {
  /** If true, Finish redirects back to /profile instead of /search */
  returnToProfile?: boolean;
}

export function OnboardingWizard({ returnToProfile = false }: OnboardingWizardProps) {
  const { profile, updateProfile } = useProfile();
  const { user, completeOnboarding } = useAuth();
  const router = useRouter();

  // Local draft — committed only on Finish, seeded from current profile
  const [draft, setDraft] = useState<UserProfile>({ ...profile });
  const [step, setStep] = useState(0);

  function patchDraft(patch: Partial<UserProfile>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleFinish() {
    updateProfile(draft);
    if (!user?.onboardingComplete) {
      completeOnboarding();
    }
    router.push(returnToProfile ? "/profile" : "/search");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-16">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
            <span className="text-3xl">🌿</span>
            Sprout
          </div>
          {user && (
            <p className="mt-1 text-sm text-gray-500">
              Welcome, {user.name.split(" ")[0]}! Let&apos;s personalise your experience.
            </p>
          )}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          <div className="p-8 space-y-8">
            {/* Step counter */}
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Step {step + 1} of {TOTAL_STEPS} — {STEP_LABELS[step]}
            </p>

            {/* Step content */}
            {step === 0 && (
              <StepGoals
                value={draft.goals}
                onChange={(goals) => patchDraft({ goals })}
              />
            )}
            {step === 1 && (
              <StepAllergens
                value={draft.allergens}
                onChange={(allergens) => patchDraft({ allergens })}
              />
            )}
            {step === 2 && (
              <StepPreferences
                value={draft.preferences}
                onChange={(preferences) => patchDraft({ preferences })}
              />
            )}
            {step === 3 && (
              <StepExtras
                avoidAdditives={draft.avoidAdditives}
                preferOrganic={draft.preferOrganic}
                onChangeAdditives={(v) => patchDraft({ avoidAdditives: v })}
                onChangeOrganic={(v) => patchDraft({ preferOrganic: v })}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="text-sm text-gray-400 hover:text-gray-600 transition"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < TOTAL_STEPS - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 active:bg-emerald-700 transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 active:bg-emerald-700 transition"
                >
                  {returnToProfile ? "Save changes" : "Finish setup →"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-emerald-500"
                  : i < step
                  ? "w-2 bg-emerald-300"
                  : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
