// app/kitchen/@cooking/page.tsx
"use client";

import { OrderColumn } from "@/components/kitchen-dashboard/OrderColumn";
import { useKitchen } from "../kitchen-context";
import { ChefHat } from "lucide-react";

export default function CookingOrders() {
  const { orders, updateOrderStatus } = useKitchen();
  
  const cookingOrders = orders.filter((order) => order.status === "cooking");

  const handleMarkReady = (order: any) => {
    updateOrderStatus(order.orderId, "ready");
  };

  return (
    <OrderColumn
      title="Cooking"
      orders={cookingOrders}
      onAction={handleMarkReady}
      actionLabel="Mark as Ready"
      actionColor="bg-green-500 hover:bg-green-600"
      variant="cooking"
      icon={<ChefHat className="w-5 h-5 text-blue-600" />}
    />
  );
}