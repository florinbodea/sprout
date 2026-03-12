import { useMemo } from "react";
import { computeHealthScore } from "@/lib/healthScore";
import { useProfile } from "@/context/ProfileContext";
import { HealthScore, Product } from "@/types";

/**
 * Derives a HealthScore for the given product using the current user profile.
 * Re-computes automatically when the product or profile changes.
 */
export function useHealthScore(product: Product | null): HealthScore | null {
  const { profile } = useProfile();

  return useMemo(() => {
    if (!product) return null;
    return computeHealthScore(product, profile);
  }, [product, profile]);
}
