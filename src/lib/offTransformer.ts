/**
 * Transforms raw Open Food Facts API responses into our clean Product type.
 * OFF API docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
 */

import { EcoScoreGrade, NutriScoreGrade, Product, NutritionFacts } from "@/types";

// ─── Raw OFF types (partial) ─────────────────────────────────────────────────

interface OFFNutriments {
  "energy-kcal_100g"?: number;
  energy_100g?: number;
  fat_100g?: number;
  "saturated-fat_100g"?: number;
  sugars_100g?: number;
  salt_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
}

export interface OFFProduct {
  _id?: string;
  id?: string;
  code?: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  ingredients_text?: string;
  ingredients_text_en?: string;
  nutriscore_grade?: string;
  nova_group?: number;
  ecoscore_grade?: string;
  nutriments?: OFFNutriments;
  allergens_tags?: string[];
  labels_tags?: string[];
  categories_tags?: string[];
}

export interface OFFSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: OFFProduct[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normaliseGrade<T extends string>(
  raw: string | undefined,
  valid: T[]
): T | null {
  if (!raw) return null;
  const lower = raw.toLowerCase() as T;
  return valid.includes(lower) ? lower : null;
}

function stripTagPrefix(tags: string[] = []): string[] {
  // OFF tags look like "en:gluten" — strip the language prefix
  return tags.map((t) => t.replace(/^[a-z]{2}:/, ""));
}

function parseNutrition(n: OFFNutriments = {}): NutritionFacts {
  const kcal =
    n["energy-kcal_100g"] ??
    (n.energy_100g ? Math.round(n.energy_100g / 4.184) : null);

  return {
    calories: kcal ?? null,
    fat: n.fat_100g ?? null,
    saturatedFat: n["saturated-fat_100g"] ?? null,
    sugar: n.sugars_100g ?? null,
    salt: n.salt_100g ?? null,
    fiber: n.fiber_100g ?? null,
    protein: n.proteins_100g ?? null,
    carbohydrates: n.carbohydrates_100g ?? null,
  };
}

// ─── Main transformer ────────────────────────────────────────────────────────

export function transformOFFProduct(raw: OFFProduct): Product {
  const nutriScoreGrades: NutriScoreGrade[] = ["a", "b", "c", "d", "e"];
  const ecoScoreGrades: EcoScoreGrade[] = ["a", "b", "c", "d", "e"];

  const novaRaw = raw.nova_group;
  const novaGroup =
    novaRaw === 1 || novaRaw === 2 || novaRaw === 3 || novaRaw === 4
      ? novaRaw
      : null;

  return {
    id: raw._id ?? raw.id ?? raw.code ?? "",
    name:
      raw.product_name_en?.trim() ||
      raw.product_name?.trim() ||
      "Unknown product",
    brand: raw.brands?.split(",")[0].trim() ?? "Unknown brand",
    imageUrl: raw.image_front_url ?? raw.image_url ?? null,
    ingredients:
      raw.ingredients_text_en?.trim() ||
      raw.ingredients_text?.trim() ||
      null,
    nutriScore: normaliseGrade(raw.nutriscore_grade, nutriScoreGrades),
    novaGroup,
    ecoScore: normaliseGrade(raw.ecoscore_grade, ecoScoreGrades),
    nutrition: parseNutrition(raw.nutriments),
    allergens: stripTagPrefix(raw.allergens_tags),
    labels: stripTagPrefix(raw.labels_tags),
    categories: stripTagPrefix(raw.categories_tags).slice(0, 5),
  };
}

export function transformOFFSearch(raw: OFFSearchResponse): {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
} {
  return {
    products: (raw.products ?? []).map(transformOFFProduct),
    total: raw.count ?? 0,
    page: raw.page ?? 1,
    pageSize: raw.page_size ?? 20,
  };
}
