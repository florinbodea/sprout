/**
 * POST /api/extract
 * Body: { url: string }
 *
 * Fetches any grocery product page, extracts product data from:
 *  1. JSON-LD Product schema (most reliable)
 *  2. Open Graph + meta tags (fallback)
 *  3. URL slug (last resort)
 *
 * Returns a partial Product object ready for health scoring.
 */

import { NextRequest, NextResponse } from "next/server";
import { NutritionFacts, Product } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&[a-z]+;/gi, "");
}

function slugToName(url: string): string {
  try {
    const { pathname } = new URL(url);
    const segments = pathname.split("/").filter(Boolean);
    let slug = segments[segments.length - 1].replace(/\.[^.]+$/, "");
    slug = slug.replace(/^\d+-/, "");
    slug = slug.replace(/-[\d]+([-.][\d]+)?\s*-?\s*(ml|l|g|kg|cl|oz|lb)$/i, "");
    return slug.replace(/[-_]+/g, " ").trim();
  } catch {
    return "Unknown product";
  }
}

function parseJsonLd(html: string): Record<string, unknown> | null {
  const matches = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item["@type"] === "Product" || item["@type"]?.includes?.("Product")) {
          return item;
        }
        // Check @graph
        if (item["@graph"]) {
          const product = item["@graph"].find(
            (n: Record<string, unknown>) => n["@type"] === "Product"
          );
          if (product) return product;
        }
      }
    } catch {
      // malformed JSON-LD — skip
    }
  }
  return null;
}

function getMeta(html: string, property: string): string | null {
  const match = html.match(
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i")
  ) || html.match(
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, "i")
  );
  return match ? match[1].trim() : null;
}

function extractImage(html: string, jsonLd: Record<string, unknown> | null): string | null {
  // From JSON-LD
  if (jsonLd?.image) {
    const img = jsonLd.image;
    if (typeof img === "string") return img;
    if (Array.isArray(img) && typeof img[0] === "string") return img[0];
    if (typeof img === "object" && img !== null && "url" in img) return img.url as string;
  }
  // Open Graph
  return getMeta(html, "og:image");
}

function extractNutrition(jsonLd: Record<string, unknown> | null): NutritionFacts {
  const empty: NutritionFacts = {
    calories: null, fat: null, saturatedFat: null, sugar: null,
    salt: null, fiber: null, protein: null, carbohydrates: null,
  };

  if (!jsonLd?.nutrition) return empty;
  const n = jsonLd.nutrition as Record<string, unknown>;

  const num = (v: unknown): number | null => {
    if (v == null) return null;
    const parsed = parseFloat(String(v).replace(/[^\d.]/g, ""));
    return isNaN(parsed) ? null : parsed;
  };

  return {
    calories: num(n.calories),
    fat: num(n.fatContent),
    saturatedFat: num(n.saturatedFatContent),
    sugar: num(n.sugarContent),
    salt: num(n.sodiumContent),
    fiber: num(n.fiberContent),
    protein: num(n.proteinContent),
    carbohydrates: num(n.carbohydrateContent),
  };
}

function extractIngredients(html: string, jsonLd: Record<string, unknown> | null): string | null {
  if (jsonLd?.description && typeof jsonLd.description === "string") {
    const desc = jsonLd.description;
    if (desc.toLowerCase().includes("ingredient")) return desc;
  }
  // Look for a common "Ingredients:" pattern in the raw HTML (strip tags)
  const match = html.replace(/<[^>]+>/g, " ").match(/ingredients?[:\s]+([^.]{20,400})/i);
  return match ? match[1].trim() : null;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let url: string;
  try {
    const body = await req.json();
    url = body.url?.trim();
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: "Invalid or missing URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Sprout/1.0; +https://sprout.app)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch page (${res.status})` },
        { status: 502 }
      );
    }

    const html = await res.text();
    const jsonLd = parseJsonLd(html);

    // ── Name ──────────────────────────────────────────────────────────────
    const name = decodeHtmlEntities(
      (typeof jsonLd?.name === "string" && jsonLd.name.trim()) ||
      getMeta(html, "og:title") ||
      getMeta(html, "twitter:title") ||
      slugToName(url)
    );

    // ── Brand ─────────────────────────────────────────────────────────────
    const brandRaw = jsonLd?.brand as Record<string, unknown> | string | null;
    const brand = decodeHtmlEntities(
      (typeof brandRaw === "object" && brandRaw !== null
        ? String(brandRaw.name ?? "")
        : String(brandRaw ?? "")) ||
      getMeta(html, "og:site_name") ||
      new URL(url).hostname.replace(/^www\./, "")
    );

    // ── Image ─────────────────────────────────────────────────────────────
    const imageUrl = extractImage(html, jsonLd);

    // ── Ingredients ───────────────────────────────────────────────────────
    const ingredients = extractIngredients(html, jsonLd);

    // ── Nutrition ─────────────────────────────────────────────────────────
    const nutrition = extractNutrition(jsonLd);

    const product: Product = {
      id: encodeURIComponent(url),
      name,
      brand,
      imageUrl,
      ingredients,
      nutriScore: null,
      novaGroup: null,
      ecoScore: null,
      nutrition,
      allergens: [],
      labels: [],
      categories: [],
    };

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[/api/extract]", err);
    return NextResponse.json(
      { error: "Failed to extract product data from that URL." },
      { status: 502 }
    );
  }
}
