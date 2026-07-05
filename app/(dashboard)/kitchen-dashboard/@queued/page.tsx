// app/kitchen/@queued/page.tsx
"use client";

import { OrderColumn } from "@/components/kitchen-dashboard/OrderColumn";
import { useKitchen } from "../kitchen-context";
import { Clock } from "lucide-react";

export default function QueuedOrders() {
  const { orders, updateOrderStatus } = useKitchen();
  
  const queuedOrders = orders.filter((order) => order.status === "queued");

  const handleStartCooking = (order: any) => {
    updateOrderStatus(order.orderId, "cooking");
  };

  return (
    <OrderColumn
      title="Queued Orders"
      orders={queuedOrders}
      onAction={handleStartCooking}
      actionLabel="Start Cooking"
      actionColor="bg-blue-500 hover:bg-blue-600"
      variant="queued"
      icon={<Clock className="w-5 h-5 text-yellow-600" />}
    />
  );
}