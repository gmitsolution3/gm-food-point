"use client";

import { useFetch } from "@/hooks/swr/useFetch";
import { useSocket } from "@/socket/socket-provider";
import { useEffect, useState } from "react";
import { notify } from "@/utils";

interface Payment {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  tableNumber: number;
  paymentMethod: string;
  amount: number;
  waitingTime: number;
  createdAt: string;
  expiresAt: string;
}

export default function CashierDashboard() {
  const { data, isLoading, isError, refetch } = useFetch(
    "/payments/pending",
  );
  const [confirmingId, setConfirmingId] = useState<string | null>(
    null,
  );
  const socket = useSocket();

  // Listen for new orders
  useEffect(() => {
    if (!socket) return;

    // Function to join the room
    const joinRoom = () => {
      console.log("Joining cashier room...");
      socket.emit("join:room", {
        role: "cashier",
      });
    };

    // Handle socket connection
    const handleConnect = () => {
      console.log("Socket connected, joining room...");
      joinRoom();
    };

    // Handle new order
    const handleNewOrder = (newOrder: any) => {
      console.log("New order received:", newOrder);
      notify.success(`New order ${newOrder.orderNumber} received!`);
      // Refetch the payments list when a new order is created
      refetch();
      // Optional: You can also show a notification or toast here
      // For example: toast.success(`New order ${newOrder.orderNumber} received!`);
    };

    // If socket is already connected, join room immediately
    if (socket.connected) {
      joinRoom();
    }

    // Listen for connection event
    socket.on("connect", handleConnect);

    // Listen for new orders
    socket.on("order:created", handleNewOrder);

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("order:created", handleNewOrder);
    };
  }, [socket, refetch]);

  const handleConfirm = async (paymentId: string) => {
    setConfirmingId(paymentId);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `/api/payments/${paymentId}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        // Refetch the list to update the UI
        refetch();
      } else {
        console.error("Failed to confirm payment");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
    } finally {
      setConfirmingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">
          Loading payments...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">
          Error loading payments. Please try again.
        </div>
      </div>
    );
  }

  const payments: Payment[] = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Pending Payments
          </h1>
          <div className="flex items-center gap-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
              </span>
              Live
            </span>
            <span className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              {payments.length} pending
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {payments.map((payment) => (
            <div
              key={payment.paymentId}
              className="bg-yellow-200 p-6 rounded-lg shadow-lg transform rotate-0 hover:rotate-1 transition-transform duration-200 flex flex-col"
              style={{
                backgroundColor: `hsl(${Math.random() * 20 + 40}, 70%, 80%)`,
                boxShadow: "5px 5px 15px rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  {payment.orderNumber}
                </h3>
                <span className="text-sm bg-white/50 px-2 py-1 rounded">
                  Table {payment.tableNumber}
                </span>
              </div>

              <div className="space-y-2 flex-grow">
                <div className="flex justify-between">
                  <span className="text-gray-700">Amount:</span>
                  <span className="font-semibold">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Method:</span>
                  <span className="capitalize bg-white/50 px-2 py-0.5 rounded text-sm">
                    {payment.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Waiting:</span>
                  <span className="text-sm">
                    {Math.floor(payment.waitingTime / 60)}m{" "}
                    {payment.waitingTime % 60}s
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10">
                <div className="text-xs text-gray-600 mb-3">
                  Expires:{" "}
                  {new Date(payment.expiresAt).toLocaleTimeString()}
                </div>

                <button
                  onClick={() => handleConfirm(payment.paymentId)}
                  disabled={confirmingId === payment.paymentId}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {confirmingId === payment.paymentId ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Confirming...
                    </span>
                  ) : (
                    "✓ Confirm Payment"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {payments.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No pending payments found.
          </div>
        )}
      </div>
    </div>
  );
}
