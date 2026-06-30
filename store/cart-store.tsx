"use client";

import { ICartContextValue, ICartItem, IMenuItem } from "@/types";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const CartContext = createContext<ICartContextValue | null>(null);

function lineKey(item: IMenuItem) {
  return item._id;
}

function linePrice(ci: ICartItem) {
  const base = ci.item.discountPrice ?? ci.item.price;
  return base * ci.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [orderType, setOrderType] = useState<
    "dine-in" | "take-out" | null
  >(null);

  const addItem = (item: IMenuItem, quantity: number) => {
    const key = lineKey(item);
    setItems((prev) => {
      const existing = prev.find((p) => p.lineId === key);
      if (existing) {
        return prev.map((p) =>
          p.lineId === key
            ? { ...p, quantity: p.quantity + quantity }
            : p,
        );
      }
      return [...prev, { lineId: key, item, quantity }];
    });
  };

  const updateQuantity = (lineId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.lineId !== lineId)
        : prev.map((p) =>
            p.lineId === lineId ? { ...p, quantity: qty } : p,
          ),
    );
  };

  const removeItem = (lineId: string) =>
    setItems((prev) => prev.filter((p) => p.lineId !== lineId));
  const clear = () => setItems([]);

  const value = useMemo<ICartContextValue>(() => {
    const effective = items.reduce((s, ci) => s + linePrice(ci), 0);
    const subtotalRaw = items.reduce((s, ci) => {
      const base = ci.item.price;
      return s + base * ci.quantity;
    }, 0);
    const discount = subtotalRaw - effective;
    const tax = effective * 0.08;
    const total = effective + tax;
    const totalItems = items.reduce((s, ci) => s + ci.quantity, 0);
    return {
      items,
      orderType,
      setOrderType,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      subtotal: subtotalRaw,
      discount,
      tax,
      total,
      totalItems,
    };
  }, [items, orderType]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx)
    throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
