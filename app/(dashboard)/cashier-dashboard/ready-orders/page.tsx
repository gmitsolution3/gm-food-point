"use client";

import CardRowInfo from "@/components/cashier-dashboard/CardRowInfo";
import { useFetch } from "@/hooks/swr/useFetch";
import { axiosInstance } from "@/lib/axios";
import { useSocket } from "@/socket/socket-provider";
import { notify } from "@/utils";
import { useCallback, useEffect, useState } from "react";

// Shadcn/ui imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import ReadyOrderError from "@/components/cashier-dashboard/readyOrder/ReadyOrderError";
import ReadyOrderLoader from "@/components/cashier-dashboard/readyOrder/ReadyOrderLoader";
import { ROLES, SOCKET_EVENTS } from "@/socket/socket.events";
import { IKitchenOrder } from "@/types";
import {
  CheckCircle2,
  ChefHat,
  Coffee,
  Users,
  Utensils,
} from "lucide-react";
import { playNotification } from "@/utils/playNotification";

export default function ReadyOrdersPage() {
  const socket = useSocket();

  // Fetch ready orders
  const { data, isLoading, isError, refetch } = useFetch(
    "/orders/kitchen?status=ready",
  );

  const [servingId, setServingId] = useState<string | null>(null);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
        role: ROLES.KITCHEN,
      });
    };

    const handleConnect = () => {
      joinRoom();
    };

    const handleNewReadyOrder = (newOrder: any) => {
      notify.success(
        `Order ${newOrder.orderNumber} is now ready to serve!`,
      );
      refetch();
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.ORDER_READY, handleNewReadyOrder);

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.ORDER_READY, handleNewReadyOrder);
    };
  }, [socket, refetch]);

  // Handle serve order action
  const handleServe = useCallback(
    async (order: IKitchenOrder) => {
      setServingId(order.orderId);
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
      } finally {
        setServingId(null);
      }
    },
    [refetch],
  );

  // Loading state
  if (isLoading) {
    return <ReadyOrderLoader />;
  }

  // Error state
  if (isError) {
    return <ReadyOrderError />;
  }

  const orders: IKitchenOrder[] = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Ready Orders 🍽️
          </h1>
          <div className="flex items-center gap-4">
            <Badge
              variant="default"
              className="bg-green-500 hover:bg-green-600 gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300" />
              </span>
              Live
            </Badge>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 px-4 py-2 text-sm"
            >
              {orders.length} ready
            </Badge>
          </div>
        </div>

        {/* Ready Orders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => (
            <Card
              key={order.orderId}
              className="bg-green-50 border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-lg text-gray-800">
                      {order.orderNumber}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      Ready
                    </Badge>
                    <Badge variant="outline" className="bg-white/50">
                      <Users className="w-3 h-3 mr-1" />
                      Table {order.tableNumber}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Items */}
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Utensils className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-700">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-medium text-gray-600">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Preparation Time */}
                <CardRowInfo
                  icon={ChefHat}
                  label="Prep Time"
                  value={`${order.orderPreparationTime}m`}
                />

                {/* Notes if any */}
                {order.notes && (
                  <div className="text-xs text-gray-500 bg-white/50 p-2 rounded-md">
                    📝 {order.notes}
                  </div>
                )}

                {/* Ready since */}
                <div className="text-xs text-gray-500 w-full text-center pt-1">
                  Ready since:{" "}
                  {new Date().toLocaleTimeString([], {
                    hour12: true,
                  })}
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  onClick={() => handleServe(order)}
                  disabled={servingId === order.orderId}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200"
                >
                  {servingId === order.orderId ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Serving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Serve Order
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <Coffee className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg">No ready orders</p>
            <p className="text-sm text-gray-400">
              Orders will appear here once they are ready to serve
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
