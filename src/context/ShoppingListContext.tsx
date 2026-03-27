"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { computeHealthScore } from "@/lib/healthScore";
import { useProfile } from "@/context/ProfileContext";
import { Product, ShoppingListItem } from "@/types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface ShoppingListContextValue {
  items: ShoppingListItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleChecked: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearList: () => void;
  isInList: (productId: string) => boolean;
}

const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "sprout:shopping-list";

function load(): ShoppingListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ShoppingListItem[]) : [];
  } catch {
    return [];
  }
}

function save(items: ShoppingListItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / private-mode errors
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const { profile } = useProfile();

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(load());
  }, []);

  // Persist whenever items change
  useEffect(() => {
    save(items);
  }, [items]);

  const addItem = useCallback(
    (product: Product) => {
      setItems((prev) => {
        if (prev.some((i) => i.product.id === product.id)) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        const score = computeHealthScore(product, profile);
        const newItem: ShoppingListItem = {
          product,
          score,
          quantity: 1,
          checked: false,
          addedAt: new Date().toISOString(),
        };
        return [newItem, ...prev];
      });
    },
    [profile]
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const toggleChecked = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, checked: !i.checked } : i
      )
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearList = useCallback(() => setItems([]), []);

  const isInList = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items]
  );

  return (
    <ShoppingListContext.Provider
      value={{ items, addItem, removeItem, toggleChecked, updateQuantity, clearList, isInList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShoppingList(): ShoppingListContextValue {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) {
    throw new Error("useShoppingList must be used inside <ShoppingListProvider>");
  }
  return ctx;
}
