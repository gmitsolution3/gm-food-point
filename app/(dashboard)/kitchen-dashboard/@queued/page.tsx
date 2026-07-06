// app/kitchen/@queued/page.tsx
"use client";

import { OrderColumn } from "@/components/kitchen-dashboard/OrderColumn";
import { useFetch } from "@/hooks/swr/useFetch";
import { axiosInstance } from "@/lib/axios";
import { useSocket } from "@/socket/socket-provider";
import { notify } from "@/utils";
import { Clock } from "lucide-react";
import { useCallback, useEffect } from "react";

interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  tableNumber: number;
  status: "queued" | "cooking" | "ready";
  orderPreparationTime: number;
  estimatedCompletionAt: string;
  notes: string;
  items: OrderItem[];
}

export default function QueuedOrders() {
  const socket = useSocket();

  // Fetch queued orders
  const { data, isLoading, isError, refetch } = useFetch(
    "/orders/kitchen?status=queued",
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Function to join the room
    const joinRoom = () => {
      socket.emit("join:room", {
        role: "kitchen",
      });
    };

    // Handle socket connection
    const handleConnect = () => {
      joinRoom();
    };

    // Handle new order
    const handleNewOrder = (newOrder: any) => {
      notify.success(`New order ${newOrder.orderNumber} received!`);
      refetch();
    };

    // If socket is already connected, join room immediately
    if (socket.connected) {
      joinRoom();
    }

    // Listen for connection event
    socket.on("connect", handleConnect);

    // Listen for new orders
    socket.on("order:queued", handleNewOrder);

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("order:queued", handleNewOrder);
    };
  }, [socket, refetch]);

  // Handle start cooking action
  const handleStartCooking = useCallback(
    async (order: Order) => {
      try {
        const res = await axiosInstance.patch(
          `/orders/${order.orderId}/start`,
        );

        if (res.data.success) {
          notify.success(
            `Order ${order.orderNumber} is now cooking!`,
          );
          refetch();
        }
      } catch (error: any) {
        notify.error(error.message || "Failed to start cooking");
      }
    },
    [refetch],
  );

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-red-500">
          Error loading queued orders. Please try again.
        </div>
      </div>
    );
  }

  const orders: Order[] = data?.data || [];

  return (
    <OrderColumn
      title="Queued Orders"
      orders={orders}
      onAction={handleStartCooking}
      actionLabel="Start Cooking"
      actionColor="bg-blue-500 hover:bg-blue-600"
      variant="queued"
      icon={<Clock className="w-5 h-5 text-yellow-600" />}
      isLoading={isLoading}
    />
  );
}
