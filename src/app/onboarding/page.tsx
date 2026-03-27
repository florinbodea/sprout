"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const returnToProfile = searchParams.get("from") === "profile";
  return <OnboardingWizard returnToProfile={returnToProfile} />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingWizard />}>
      <OnboardingContent />
    </Suspense>
  );
}
