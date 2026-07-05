// app/kitchen/kitchen-context.tsx
"use client";

import { Order } from "@/components/kitchen-dashboard/OrderCard";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

interface KitchenContextType {
  orders: Order[];
  updateOrderStatus: (
    orderId: string,
    newStatus: Order["status"],
  ) => void;
}

const KitchenContext = createContext<KitchenContextType | undefined>(
  undefined,
);

const initialOrders: Order[] = [
  {
    orderId: "6a4a0122a71d781d1a8b429a",
    orderNumber: "GM-0001",
    tableNumber: 15,
    status: "queued",
    orderPreparationTime: 20,
    estimatedCompletionAt: "2026-07-05T07:20:50.024Z",
    notes: "No onions please",
    items: [
      { name: "Beef Burger", quantity: 1 },
      { name: "French Fries", quantity: 2 },
    ],
  },
  {
    orderId: "6a4a0122a71d781d1a8b429b",
    orderNumber: "GM-0002",
    tableNumber: 8,
    status: "queued",
    orderPreparationTime: 15,
    estimatedCompletionAt: "2026-07-05T07:15:50.024Z",
    notes: "",
    items: [
      { name: "Margherita Pizza", quantity: 1 },
      { name: "Garlic Bread", quantity: 1 },
    ],
  },
  {
    orderId: "6a4a0122a71d781d1a8b429c",
    orderNumber: "GM-0003",
    tableNumber: 22,
    status: "cooking",
    orderPreparationTime: 25,
    estimatedCompletionAt: "2026-07-05T07:30:50.024Z",
    notes: "Well done steak",
    items: [
      { name: "Ribeye Steak", quantity: 1 },
      { name: "Mashed Potatoes", quantity: 1 },
      { name: "Grilled Vegetables", quantity: 1 },
    ],
  },
  {
    orderId: "6a4a0122a71d781d1a8b429d",
    orderNumber: "GM-0004",
    tableNumber: 5,
    status: "cooking",
    orderPreparationTime: 10,
    estimatedCompletionAt: "2026-07-05T07:05:50.024Z",
    notes: "Extra spicy",
    items: [
      { name: "Chicken Wings", quantity: 2 },
      { name: "Onion Rings", quantity: 1 },
    ],
  },
  {
    orderId: "6a4a0122a71d781d1a8b429e",
    orderNumber: "GM-0005",
    tableNumber: 12,
    status: "ready",
    orderPreparationTime: 15,
    estimatedCompletionAt: "2026-07-05T06:55:50.024Z",
    notes: "",
    items: [
      { name: "Caesar Salad", quantity: 1 },
      { name: "Grilled Chicken", quantity: 1 },
    ],
  },
  {
    orderId: "6a4a0122a71d781d1a8b429f",
    orderNumber: "GM-0006",
    tableNumber: 3,
    status: "ready",
    orderPreparationTime: 20,
    estimatedCompletionAt: "2026-07-05T06:50:50.024Z",
    notes: "Gluten free pasta",
    items: [
      { name: "Pasta Carbonara", quantity: 1 },
      { name: "Tiramisu", quantity: 1 },
    ],
  },
];

export function KitchenProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateOrderStatus = (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? { ...order, status: newStatus }
          : order,
      ),
    );
  };

  return (
    <KitchenContext.Provider value={{ orders, updateOrderStatus }}>
      {children}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  const context = useContext(KitchenContext);
  if (context === undefined) {
    throw new Error(
      "useKitchen must be used within a KitchenProvider",
    );
  }
  return context;
}
