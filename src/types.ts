// ─── Nutrition ────────────────────────────────────────────────────────────────

export interface NutritionFacts {
  calories: number | null;          // kcal per 100g
  fat: number | null;               // g per 100g
  saturatedFat: number | null;
  sugar: number | null;
  salt: number | null;              // g per 100g
  fiber: number | null;
  protein: number | null;
  carbohydrates: number | null;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;                       // barcode / OFF product id
  name: string;
  brand: string;
  imageUrl: string | null;
  ingredients: string | null;
  nutriScore: NutriScoreGrade | null;  // A–E from Open Food Facts
  novaGroup: 1 | 2 | 3 | 4 | null;    // food processing level
  ecoScore: EcoScoreGrade | null;
  nutrition: NutritionFacts;
  allergens: string[];
  labels: string[];                 // e.g. "organic", "fair-trade"
  categories: string[];
}

export type NutriScoreGrade = "a" | "b" | "c" | "d" | "e";
export type EcoScoreGrade = "a" | "b" | "c" | "d" | "e";

// ─── Health Score ─────────────────────────────────────────────────────────────

export type HealthGrade = "A" | "B" | "C" | "D" | "F";

export interface HealthScoreBreakdown {
  nutriScore: number;       // 0–25
  nova: number;             // 0–25
  nutrition: number;        // 0–30  (based on raw nutritional values)
  profileBonus: number;     // 0–20  (personalization bonus/penalty)
}

export interface HealthScore {
  total: number;            // 0–100
  grade: HealthGrade;
  breakdown: HealthScoreBreakdown;
  warnings: string[];       // e.g. "High sugar", "Ultra-processed"
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export type DietaryGoal =
  | "weight-loss"
  | "muscle-gain"
  | "heart-health"
  | "diabetes-friendly"
  | "general-wellness";

export type Allergen =
  | "gluten"
  | "dairy"
  | "eggs"
  | "nuts"
  | "peanuts"
  | "soy"
  | "fish"
  | "shellfish"
  | "sesame";

export type DietaryPreference =
  | "vegan"
  | "vegetarian"
  | "pescatarian"
  | "keto"
  | "paleo"
  | "halal"
  | "kosher";

export interface UserProfile {
  goals: DietaryGoal[];
  allergens: Allergen[];
  preferences: DietaryPreference[];
  avoidAdditives: boolean;          // penalise NOVA 4 more heavily
  preferOrganic: boolean;           // boost organic-labelled products
}

export const DEFAULT_PROFILE: UserProfile = {
  goals: ["general-wellness"],
  allergens: [],
  preferences: [],
  avoidAdditives: false,
  preferOrganic: false,
};

// ─── Shopping List ────────────────────────────────────────────────────────────

export interface ShoppingListItem {
  product: Product;
  score: HealthScore;
  quantity: number;
  checked: boolean;
  addedAt: string;                  // ISO date string
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;                   // crypto.randomUUID() generated at registration
  name: string;
  email: string;
  registeredAt: string;         // ISO date string
  onboardingComplete: boolean;
  // Note: password is intentionally NOT stored — validated on the form for
  // demo credibility but never persisted anywhere.
}

export const AUTH_STORAGE_KEY = "sprout:auth";
