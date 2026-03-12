import { NextRequest, NextResponse } from "next/server";
import { OFFSearchResponse, transformOFFSearch } from "@/lib/offTransformer";
import { SearchResult } from "@/types";

const OFF_BASE = "https://world.openfoodfacts.org";

// Fields we actually need — keeps the payload small
const FIELDS = [
  "_id",
  "code",
  "product_name",
  "product_name_en",
  "brands",
  "image_front_url",
  "ingredients_text",
  "ingredients_text_en",
  "nutriscore_grade",
  "nova_group",
  "ecoscore_grade",
  "nutriments",
  "allergens_tags",
  "labels_tags",
  "categories_tags",
].join(",");

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q")?.trim();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Math.min(Number(searchParams.get("pageSize") ?? "20"), 50);

  if (!query) {
    return NextResponse.json(
      { error: "Missing query parameter: q" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(`${OFF_BASE}/cgi/search.pl`);
    url.searchParams.set("search_terms", query);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page", String(page));
    url.searchParams.set("page_size", String(pageSize));
    url.searchParams.set("fields", FIELDS);
    url.searchParams.set("sort_by", "unique_scans_n"); // most scanned first

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Sprout/1.0 (hackathon project; contact@sprout.app)",
      },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`OFF API responded with ${res.status}`);
    }

    const raw: OFFSearchResponse = await res.json();
    const result: SearchResult = transformOFFSearch(raw);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/search] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products. Please try again." },
      { status: 502 }
    );
  }
}
