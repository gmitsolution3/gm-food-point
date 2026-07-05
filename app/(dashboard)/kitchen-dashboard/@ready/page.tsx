// app/kitchen/@ready/page.tsx
"use client";

import { OrderColumn } from "@/components/kitchen-dashboard/OrderColumn";
import { useKitchen } from "../kitchen-context";
import { Coffee } from "lucide-react";

export default function ReadyOrders() {
  const { orders, updateOrderStatus } = useKitchen();
  
  const readyOrders = orders.filter((order) => order.status === "ready");

  const handleServe = (order: any) => {
    // In a real app, this would remove the order or mark as served
    alert(`Order ${order.orderNumber} has been served!`);
    // You could remove it from the list or keep it with a "served" status
    // For now, we'll just show an alert
  };

  return (
    <OrderColumn
      title="Ready to Serve"
      orders={readyOrders}
      onAction={handleServe}
      actionLabel="Serve Order"
      actionColor="bg-purple-500 hover:bg-purple-600"
      variant="ready"
      icon={<Coffee className="w-5 h-5 text-green-600" />}
    />
  );
}