"use client";

import { useFetch } from "@/hooks/swr/useFetch";
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

import {
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Table,
} from "lucide-react";

import PaymentConfirmModal from "@/components/cashier-dashboard/paymentRequest/PaymentConfirmModal";
import PaymentRequestError from "@/components/cashier-dashboard/paymentRequest/PaymentRequestError";
import PaymentRequestLoader from "@/components/cashier-dashboard/paymentRequest/PaymentRequestLoader";
import { usePost } from "@/hooks/swr/usePost";
import { IPendingPayment } from "@/types";
import CardRowInfo from "@/components/cashier-dashboard/CardRowInfo";
import { SOCKET_EVENTS, ROLES } from "@/socket/socket.events";

export default function CashierDashboard() {
  const { data, isLoading, isError, refetch } = useFetch(
    "/payments/pending",
  );
  const socket = useSocket();

  // State for payment confirmation
  const [selectedPayment, setSelectedPayment] =
    useState<IPendingPayment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // API hook for confirming payment
  const { mutate: confirmPayment, isLoading: isPaymentConfirming } =
    usePost(`/payments/cash/${selectedPayment?.paymentId}/confirm`);

  // Socket connection and event listeners
  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
        role: ROLES.CASHIER,
      });
    };

    const handleConnect = () => {
      joinRoom();
    };

    const handleNewOrder = (newOrder: any) => {
      notify.success(`New order ${newOrder.orderNumber} received!`);
      refetch();
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.ORDER_CREATED, handleNewOrder);

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.ORDER_CREATED, handleNewOrder);
    };
  }, [socket, refetch]);

  // Handle confirm button click
  const handleConfirmClick = useCallback(
    (payment: IPendingPayment) => {
      setSelectedPayment(payment);
      setPaymentAmount(payment.amount.toString());
      setIsConfirmModalOpen(true);
    },
    [],
  );

  // Handle payment confirmation
  const handleConfirm = useCallback(async () => {
    if (!selectedPayment) return;

    try {
      const response = await confirmPayment({
        amountReceived: parseFloat(paymentAmount),
      });

      if (response.success) {
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
    }
  }, [selectedPayment, paymentAmount, confirmPayment, refetch]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setSelectedPayment(null);
    setPaymentAmount("");
  }, []);

  // Early returns for loading and error states
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
        {/* Header */}
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300" />
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

        {/* Payment Cards Grid */}
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
                <CardRowInfo
                  icon={DollarSign}
                  label="Amount"
                  value={`$${payment.amount.toFixed(2)}`}
                />
                <CardRowInfo
                  icon={CreditCard}
                  label="Method"
                  value={
                    <Badge
                      variant="outline"
                      className="capitalize bg-white/50 text-gray-600"
                    >
                      {payment.paymentMethod}
                    </Badge>
                  }
                />
                <CardRowInfo
                  icon={Clock}
                  label="Waiting"
                  value={`${Math.floor(payment.waitingTime / 60)}m ${
                    payment.waitingTime % 60
                  }s`}
                  valueClassName="text-sm font-medium"
                />
              </CardContent>

              <CardFooter className="pt-2 flex-col gap-3">
                <div className="text-xs text-gray-500 w-full text-center">
                  Expires:{" "}
                  {new Date(payment.expiresAt).toLocaleTimeString(
                    [],
                    {
                      hour12: true,
                    },
                  )}
                </div>
                <Button
                  onClick={() => handleConfirmClick(payment)}
                  disabled={isPaymentConfirming}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Payment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
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
        setIsConfirmModalOpen={handleCloseModal}
        setPaymentAmount={setPaymentAmount}
        setSelectedPayment={handleCloseModal}
        paymentAmount={paymentAmount}
        handleConfirm={handleConfirm}
        isPaymentConfirming={isPaymentConfirming}
      />
    </div>
  );
}
