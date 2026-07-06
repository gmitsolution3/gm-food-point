"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetchById } from "@/hooks/swr/useFetchById";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Loader2, ShieldCheck } from "lucide-react";
import Countdown from "@/components/home/order/Countdown";

interface IOrderItem {
  menuId: string;
  menuName: string;
  categoryId: string;
  categoryName: string;
  originalUnitPrice: number;
  effectiveUnitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface IOrder {
  _id: string;
  orderNumber: string;
  businessDate: string;
  tableNumber: number;
  createdBy: string;
  orderType: "dine-in" | "take-out";
  paymentMethod: string;
  status: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  taxPercentage: number;
  taxAmount: number;
  serviceChargePercentage: number;
  serviceChargeAmount: number;
  grandTotal: number;
  orderPreparationTime: number;
  estimatedCompletionAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface IOrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IOrder;
}

export default function OrderSummeryPage() {
  const { orderId } = useParams();

  const { data, isLoading, isError, refetch } = useFetchById<IOrderResponse>(
    "/orders",
    orderId as string,
  );

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold mb-2">Failed to load order</h3>
          <p className="text-muted-foreground">
            {isError ? "Please try again later" : "Order not found"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatEstimatedTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const estimatedTimeFormatted = formatEstimatedTime(order.estimatedCompletionAt);

  const message =
    order.orderType === "dine-in"
      ? "We'll bring your order to your table shortly."
      : order.orderType === "take-out"
        ? "We'll have it ready at the counter soon."
        : "Our courier will be on the way shortly.";

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/menu"
            aria-label="Back"
            className="grid h-10 w-10 place-items-center rounded-full bg-muted hover:bg-secondary hover:text-secondary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <Badge
              variant="outline"
              className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground border-0 px-0"
            >
              Order Status
            </Badge>
            <h1 className="text-xl font-extrabold leading-tight">
              Order #{order.orderNumber}
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="w-full overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-lift)]"
        >
          <div
            aria-hidden
            className="h-2"
            style={{ background: "var(--gradient-primary)" }}
          />

          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-6 sm:p-8">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                  delay: 0.1,
                }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-yellow)]"
              >
                <ShieldCheck className="h-10 w-10" />
              </motion.div>

              <h1 className="mt-6 text-center text-3xl font-extrabold">
                Order placed!
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {message}
              </p>

              {/* Countdown Section */}
              <div className="mt-6">
                <Countdown
                  estimatedCompletionAt={order.estimatedCompletionAt}
                  orderNumber={order.orderNumber}
                />
              </div>

              {/* Order Details */}
              <div className="mt-6 rounded-2xl bg-muted/60 p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-extrabold tracking-wider">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-extrabold capitalize">
                    <Badge variant="outline" className="capitalize">
                      {order.status.replace("_", " ")}
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-extrabold">
                    ${order.grandTotal.toFixed(2)}
                  </span>
                </div>
                {order.orderPreparationTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Prep Time
                    </span>
                    <span className="font-extrabold">
                      ~{order.orderPreparationTime} mins
                    </span>
                  </div>
                )}
                {estimatedTimeFormatted && (
                  <div className="flex justify-between text-sm border-t border-border/50 pt-2 mt-1">
                    <span className="text-muted-foreground">
                      Estimated Ready
                    </span>
                    <span className="font-extrabold text-primary">
                      {estimatedTimeFormatted}
                    </span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h3 className="text-sm font-bold tracking-wider uppercase text-muted-foreground mb-3">
                  Order Items
                </h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.menuId}
                      className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                    >
                      <div>
                        <div className="text-sm font-semibold">
                          {item.menuName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ${item.effectiveUnitPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm font-extrabold">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/menu"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-yellow)] transition-colors hover:bg-primary/90"
                >
                  Order Again <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-secondary bg-card px-6 py-3.5 text-sm font-extrabold text-foreground transition-colors hover:bg-secondary"
                >
                  Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}