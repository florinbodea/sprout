"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Product, SearchResult } from "@/types";

function isUrl(input: string): boolean {
  try {
    const u = new URL(input.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

interface UseSearchState {
  query: string;
  results: Product[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
}

interface UseSearchReturn extends UseSearchState {
  setQuery: (q: string) => void;
  setPage: (p: number) => void;
  retry: () => void;
  clear: () => void;
}

// Debounce URL pastes less aggressively than keystrokes
const DEBOUNCE_MS = 400;
const URL_DEBOUNCE_MS = 100;

export function useSearch(initialQuery = ""): UseSearchReturn {
  const [query, setQueryRaw] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<Omit<UseSearchState, "query" | "page">>({
    results: [],
    total: 0,
    pageSize: 20,
    isLoading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  // Debounce the query
  useEffect(() => {
    const delay = isUrl(query) ? URL_DEBOUNCE_MS : DEBOUNCE_MS;
    const id = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, delay);
    return () => clearTimeout(id);
  }, [query]);

  const fetchFromUrl = useCallback(async (url: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Could not extract product (${res.status})`);
      }

      const { product }: { product: Product } = await res.json();
      setState({
        results: [product],
        total: 1,
        pageSize: 1,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: (err as Error).message ?? "Failed to extract product from URL",
      }));
    }
  }, []);

  const fetchResults = useCallback(
    async (q: string, p: number) => {
      if (!q.trim()) {
        setState({ results: [], total: 0, pageSize: 20, isLoading: false, error: null });
        return;
      }

      // URL path — call extract endpoint
      if (isUrl(q)) {
        fetchFromUrl(q);
        return;
      }

      // Cancel any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const url = `/api/search?q=${encodeURIComponent(q)}&page=${p}&pageSize=20`;
        const res = await fetch(url, { signal: abortRef.current.signal });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Request failed (${res.status})`);
        }

        const data: SearchResult = await res.json();
        setState({
          results: data.products,
          total: data.total,
          pageSize: data.pageSize,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: (err as Error).message ?? "Something went wrong",
        }));
      }
    },
    [fetchFromUrl]
  );

  // Trigger fetch when debounced query or page changes
  useEffect(() => {
    fetchResults(debouncedQuery, page);
  }, [debouncedQuery, page, fetchResults]);

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q);
  }, []);

  const retry = useCallback(() => {
    fetchResults(debouncedQuery, page);
  }, [debouncedQuery, page, fetchResults]);

  const clear = useCallback(() => {
    setQueryRaw("");
    setDebouncedQuery("");
    setState({ results: [], total: 0, pageSize: 20, isLoading: false, error: null });
  }, []);

  return {
    query,
    ...state,
    page,
    setQuery,
    setPage,
    retry,
    clear,
  };
}
