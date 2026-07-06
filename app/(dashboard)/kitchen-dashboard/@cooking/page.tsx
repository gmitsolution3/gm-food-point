// app/kitchen/@cooking/page.tsx
"use client";

import { OrderColumn } from "@/components/kitchen-dashboard/OrderColumn";
import { useFetch } from "@/hooks/swr/useFetch";
import { axiosInstance } from "@/lib/axios";
import { useSocket } from "@/socket/socket-provider";
import { SOCKET_EVENTS, ROLES } from "@/socket/socket.events";
import { IKitchenOrder } from "@/types";
import { notify } from "@/utils";
import { ChefHat } from "lucide-react";
import { useCallback, useEffect } from "react";

export default function CookingOrders() {
  const socket = useSocket();

  // Fetch cooking orders
  const { data, isLoading, isError, refetch } = useFetch(
    "/orders/kitchen?status=cooking",
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Function to join the room
    const joinRoom = () => {
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
        role: ROLES.KITCHEN,
      });
    };

    // Handle socket connection
    const handleConnect = () => {
      joinRoom();
    };

    // Handle new cooking order
    const handleCookingCookingOrder = (newOrder: IKitchenOrder) => {
      notify.success(`Order ${newOrder.orderNumber} is now cooking!`);
      refetch();
    };

    // If socket is already connected, join room immediately
    if (socket.connected) {
      joinRoom();
    }

    // Listen for connection event
    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);

    // Listen for order started cooking
    socket.on(SOCKET_EVENTS.ORDER_COOKING, handleCookingCookingOrder);

    // Cleanup listeners on unmount
    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.ORDER_COOKING, handleCookingCookingOrder);
    };
  }, [socket, refetch]);

  // Handle mark as ready action
  const handleMarkReady = useCallback(
    async (order: IKitchenOrder) => {
      try {
        const res = await axiosInstance.patch(
          `/orders/${order.orderId}/ready`,
        );

        if (res.data.success) {
          notify.success(
            `Order ${order.orderNumber} is now ready!`,
          );
          refetch();
        }
      } catch (error: any) {
        notify.error(error.message || "Failed to mark order as ready");
      }
    },
    [refetch],
  );

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-red-500">
          Error loading cooking orders. Please try again.
        </div>
      </div>
    );
  }

  const orders: IKitchenOrder[] = data?.data || [];

  return (
    <OrderColumn
      title="Cooking"
      orders={orders}
      onAction={handleMarkReady}
      actionLabel="Mark as Ready"
      actionColor="bg-green-500 hover:bg-green-600"
      variant="cooking"
      icon={<ChefHat className="w-5 h-5 text-blue-600" />}
      isLoading={isLoading}
      skeletonCount={3}
    />
  );
}