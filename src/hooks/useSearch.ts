"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Product, SearchResult } from "@/types";

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

const DEBOUNCE_MS = 400;

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
    const id = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // reset to page 1 on new query
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const fetchResults = useCallback(
    async (q: string, p: number) => {
      if (!q.trim()) {
        setState({ results: [], total: 0, pageSize: 20, isLoading: false, error: null });
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
        if ((err as Error).name === "AbortError") return; // ignore cancellations
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: (err as Error).message ?? "Something went wrong",
        }));
      }
    },
    []
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
