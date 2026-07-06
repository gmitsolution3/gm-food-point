// app/kitchen/@ready/page.tsx
"use client";

import { OrderColumn } from "@/components/kitchen-dashboard/OrderColumn";
import { useFetch } from "@/hooks/swr/useFetch";
import { axiosInstance } from "@/lib/axios";
import { useSocket } from "@/socket/socket-provider";
import { ROLES, SOCKET_EVENTS } from "@/socket/socket.events";
import { IKitchenOrder } from "@/types";
import { notify } from "@/utils";
import { Coffee } from "lucide-react";
import { useCallback, useEffect } from "react";

export default function ReadyOrders() {
  const socket = useSocket();

  // Fetch ready orders
  const { data, isLoading, isError, refetch } = useFetch(
    "/orders/kitchen?status=ready",
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Function to join the room
    const joinRoom = () => {
      socket.emit(SOCKET_EVENTS.CONNECT, {
        role: ROLES.KITCHEN,
      });
    };

    // Handle socket connection
    const handleConnect = () => {
      joinRoom();
    };

    // Handle new ready order
    const handleNewReadyOrder = (newOrder: IKitchenOrder) => {
      notify.success(`Order ${newOrder.orderNumber} is now ready!`);
      refetch();
    };

    // If socket is already connected, join room immediately
    if (socket.connected) {
      joinRoom();
    }

    // Listen for connection event
    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);

    // Listen for order marked as ready
    socket.on(SOCKET_EVENTS.ORDER_READY, handleNewReadyOrder);

    // Cleanup listeners on unmount
    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.ORDER_READY, handleNewReadyOrder);
    };
  }, [socket, refetch]);

  // Handle serve/complete order action
  const handleServe = useCallback(
    async (order: IKitchenOrder) => {
      try {
        const res = await axiosInstance.patch(
          `/orders/${order.orderId}/complete`,
        );

        if (res.data.success) {
          notify.success(
            `Order ${order.orderNumber} has been served!`,
          );
          refetch();
        }
      } catch (error: any) {
        notify.error(error.message || "Failed to serve order");
      }
    },
    [refetch],
  );

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-red-500">
          Error loading ready orders. Please try again.
        </div>
      </div>
    );
  }

  const orders: IKitchenOrder[] = data?.data || [];

  return (
    <OrderColumn
      title="Ready to Serve"
      orders={orders}
      onAction={handleServe}
      actionLabel="Serve Order"
      actionColor="bg-purple-500 hover:bg-purple-600"
      variant="ready"
      icon={<Coffee className="w-5 h-5 text-green-600" />}
      isLoading={isLoading}
      skeletonCount={3}
    />
  );
}
