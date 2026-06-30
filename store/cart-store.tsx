"use client";

import { useFetch } from "@/hooks/swr/useFetch";
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

  // Fetch settings
  const { data: settingsData } = useFetch<{
    success: boolean;
    statusCode: number;
    message: string;
    data: {
      _id: string;
      restaurantName: string;
      restaurantLogo: string | null;
      address: string;
      contactNumber: string;
      email: string;
      currency: string;
      taxPercentage: number;
      serviceChargePercentage: number;
      isTaxEnabled: boolean;
      isServiceChargeEnabled: boolean;
      orderNumberPrefix: string;
      isRestaurantOpen: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }>("/settings");

  // Extract settings
  const settings = settingsData?.data;
  const taxPercentage = settings?.taxPercentage ?? 0;
  const serviceChargePercentage =
    settings?.serviceChargePercentage ?? 0;
  const isTaxEnabled = settings?.isTaxEnabled ?? false;
  const isServiceChargeEnabled =
    settings?.isServiceChargeEnabled ?? false;

  // Log settings
  console.log("Settings:", settings);

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

    // Calculate tax based on settings
    const tax = isTaxEnabled ? effective * (taxPercentage / 100) : 0;

    // Calculate service charge based on settings
    const serviceCharge = isServiceChargeEnabled
      ? effective * (serviceChargePercentage / 100)
      : 0;

    const total = effective + tax + serviceCharge;
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
      taxPercentage: isTaxEnabled ? taxPercentage : 0, // Add this
      serviceCharge,
      serviceChargePercentage: isServiceChargeEnabled
        ? serviceChargePercentage
        : 0, // Add this
      total,
      totalItems,
    };
  }, [items, orderType, settings]);

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
