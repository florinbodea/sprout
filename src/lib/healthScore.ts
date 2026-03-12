import {
  HealthGrade,
  HealthScore,
  HealthScoreBreakdown,
  NutriScoreGrade,
  Product,
  UserProfile,
} from "@/types";

// ─── Nutri-Score → points (0–25) ─────────────────────────────────────────────

const NUTRI_SCORE_POINTS: Record<NutriScoreGrade, number> = {
  a: 25,
  b: 20,
  c: 13,
  d: 6,
  e: 0,
};

function scoreNutriScore(grade: NutriScoreGrade | null): number {
  if (!grade) return 10; // neutral when unknown
  return NUTRI_SCORE_POINTS[grade];
}

// ─── NOVA group → points (0–25) ──────────────────────────────────────────────

const NOVA_POINTS: Record<1 | 2 | 3 | 4, number> = {
  1: 25,
  2: 18,
  3: 10,
  4: 0,
};

function scoreNova(group: 1 | 2 | 3 | 4 | null): number {
  if (!group) return 12; // neutral when unknown
  return NOVA_POINTS[group];
}

// ─── Raw nutrition → points (0–30) ───────────────────────────────────────────
// Rewards fibre & protein; penalises sugar, saturated fat, salt, calories

function scoreNutrition(p: Product): number {
  const n = p.nutrition;
  let score = 15; // start at mid-point

  // Positive contributors
  if (n.fiber !== null) score += Math.min(n.fiber / 10, 1) * 8;        // up to +8
  if (n.protein !== null) score += Math.min(n.protein / 30, 1) * 7;    // up to +7

  // Negative contributors
  if (n.sugar !== null) score -= Math.min(n.sugar / 40, 1) * 8;        // up to -8
  if (n.saturatedFat !== null) score -= Math.min(n.saturatedFat / 15, 1) * 5; // up to -5
  if (n.salt !== null) score -= Math.min(n.salt / 3, 1) * 5;           // up to -5
  if (n.calories !== null) score -= Math.min(n.calories / 900, 1) * 4; // up to -4

  return Math.round(Math.max(0, Math.min(30, score)));
}

// ─── Profile bonus/penalty (0–20) ────────────────────────────────────────────

function scoreProfileBonus(product: Product, profile: UserProfile): number {
  let bonus = 10; // neutral baseline

  // Allergen penalty — hard flag (doesn't reduce score, handled in warnings)
  // Goals
  if (profile.goals.includes("weight-loss")) {
    if (product.nutrition.calories !== null && product.nutrition.calories < 150) bonus += 3;
    if (product.nutrition.sugar !== null && product.nutrition.sugar < 5) bonus += 2;
  }

  if (profile.goals.includes("muscle-gain")) {
    if (product.nutrition.protein !== null && product.nutrition.protein > 15) bonus += 5;
  }

  if (profile.goals.includes("heart-health")) {
    if (product.nutrition.saturatedFat !== null && product.nutrition.saturatedFat < 2) bonus += 3;
    if (product.nutrition.salt !== null && product.nutrition.salt < 0.5) bonus += 2;
  }

  if (profile.goals.includes("diabetes-friendly")) {
    if (product.nutrition.sugar !== null && product.nutrition.sugar < 5) bonus += 4;
    if (product.nutrition.fiber !== null && product.nutrition.fiber > 3) bonus += 2;
  }

  // Additive avoidance
  if (profile.avoidAdditives && product.novaGroup === 4) bonus -= 5;

  // Organic preference
  if (profile.preferOrganic) {
    const isOrganic = product.labels.some((l) =>
      l.toLowerCase().includes("organic")
    );
    if (isOrganic) bonus += 3;
  }

  return Math.round(Math.max(0, Math.min(20, bonus)));
}

// ─── Warnings ────────────────────────────────────────────────────────────────

function buildWarnings(product: Product, profile: UserProfile): string[] {
  const warnings: string[] = [];
  const n = product.nutrition;

  if (n.sugar !== null && n.sugar > 22.5) warnings.push("High sugar");
  if (n.saturatedFat !== null && n.saturatedFat > 5) warnings.push("High saturated fat");
  if (n.salt !== null && n.salt > 1.5) warnings.push("High salt");
  if (n.calories !== null && n.calories > 500) warnings.push("High calories");
  if (product.novaGroup === 4) warnings.push("Ultra-processed food");
  if (product.nutriScore === "d" || product.nutriScore === "e")
    warnings.push("Poor Nutri-Score");

  // Allergen warnings
  const productAllergens = product.allergens.map((a) => a.toLowerCase());
  for (const allergen of profile.allergens) {
    if (productAllergens.some((a) => a.includes(allergen))) {
      warnings.push(`Contains ${allergen}`);
    }
  }

  return warnings;
}

// ─── Grade from total ─────────────────────────────────────────────────────────

function totalToGrade(total: number): HealthGrade {
  if (total >= 80) return "A";
  if (total >= 65) return "B";
  if (total >= 50) return "C";
  if (total >= 35) return "D";
  return "F";
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function computeHealthScore(
  product: Product,
  profile: UserProfile
): HealthScore {
  const breakdown: HealthScoreBreakdown = {
    nutriScore: scoreNutriScore(product.nutriScore),
    nova: scoreNova(product.novaGroup),
    nutrition: scoreNutrition(product),
    profileBonus: scoreProfileBonus(product, profile),
  };

  const total = Math.round(
    breakdown.nutriScore +
      breakdown.nova +
      breakdown.nutrition +
      breakdown.profileBonus
  );

  return {
    total: Math.max(0, Math.min(100, total)),
    grade: totalToGrade(total),
    breakdown,
    warnings: buildWarnings(product, profile),
  };
}
