"use client";

import { useFetch } from "@/hooks/swr/useFetch";
import { useSocket } from "@/socket/socket-provider";
import { notify } from "@/utils";
import { useEffect, useState } from "react";

// Shadcn/ui imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import {
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Loader2,
  Table,
} from "lucide-react";

import PaymentConfirmModal from "@/components/cashier-dashboard/paymentRequest/PaymentConfirmModal";
import PaymentRequestError from "@/components/cashier-dashboard/paymentRequest/PaymentRequestError";
import PaymentRequestLoader from "@/components/cashier-dashboard/paymentRequest/PaymentRequestLoader";
import { usePost } from "@/hooks/swr/usePost";
import { IPendingPayment } from "@/types";

export default function CashierDashboard() {
  const { data, isLoading, isError, refetch } = useFetch(
    "/payments/pending",
  );
  const [confirmingId, setConfirmingId] = useState<string | null>(
    null,
  );
  const [selectedPayment, setSelectedPayment] =
    useState<IPendingPayment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    mutate: confirmPayment,
    isLoading: isPaymentConfirming,
    isError: isPaymentConfirmingError,
  } = usePost(`/payments/cash/${selectedPayment?.paymentId}/confirm`);

  const socket = useSocket();

  // Listen for new orders
  useEffect(() => {
    if (!socket) return;

    // Function to join the room
    const joinRoom = () => {
      socket.emit("join:room", {
        role: "cashier",
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
    socket.on("order:created", handleNewOrder);

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("order:created", handleNewOrder);
    };
  }, [socket, refetch]);

  const handleConfirmClick = (payment: IPendingPayment) => {
    setSelectedPayment(payment);
    setPaymentAmount(payment.amount.toString());
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedPayment) return;

    setConfirmingId(selectedPayment.paymentId);
    try {

      const response = await confirmPayment({
        amountReceived: parseFloat(paymentAmount)
      });

      if(response.success) {
         notify.success(
          `Payment ${selectedPayment.orderNumber} confirmed successfully!`,
        );

        refetch();
        setIsConfirmModalOpen(false);
        setSelectedPayment(null);
        setPaymentAmount("");
      }
      
    } catch (error: any) {
      notify.error(error.message || "Error confirming payment");
    } finally {
      setConfirmingId(null);
    }
  };

  if (isLoading) {
    return <PaymentRequestLoader />;
  }

  if (isError) {
    return <PaymentRequestError />;
  }

  const payments: IPendingPayment[] = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Payment Requests 🔔
          </h1>
          <div className="flex items-center gap-4">
            <Badge
              variant="default"
              className="bg-green-500 hover:bg-green-600 gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
              </span>
              Live
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 px-4 py-2 text-sm"
            >
              {payments.length} pending
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {payments.map((payment) => (
            <Card
              key={payment.paymentId}
              className="bg-yellow-50 border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-800">
                      {payment.orderNumber}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-white/50">
                    <Table className="w-3 h-3 mr-1" />
                    Table {payment.tableNumber}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Amount:
                  </span>
                  <span className="font-semibold">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Method:
                  </span>
                  <Badge
                    variant="outline"
                    className="capitalize bg-white/50 text-gray-600"
                  >
                    {payment.paymentMethod}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Waiting:
                  </span>
                  <span className="text-sm font-medium">
                    {Math.floor(payment.waitingTime / 60)}m{" "}
                    {payment.waitingTime % 60}s
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-2 flex-col gap-3">
                <div className="text-xs text-gray-500 w-full text-center">
                  Expires:{" "}
                  {new Date(payment.expiresAt).toLocaleTimeString()}
                </div>
                <Button
                  onClick={() => handleConfirmClick(payment)}
                  disabled={confirmingId === payment.paymentId}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  {confirmingId === payment.paymentId ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm Payment
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {payments.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No payment request available now.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <PaymentConfirmModal
        selectedPayment={selectedPayment}
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        setPaymentAmount={setPaymentAmount}
        setSelectedPayment={setSelectedPayment}
        paymentAmount={paymentAmount}
        handleConfirm={handleConfirm}
      />
    </div>
  );
}
