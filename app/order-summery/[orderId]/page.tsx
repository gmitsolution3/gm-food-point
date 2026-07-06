"use client";

import Countdown from "@/components/home/order/Countdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchById } from "@/hooks/swr/useFetchById";
import { IOrder } from "@/types";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Clock as ClockIcon,
  CreditCard,
  Loader2,
  Package,
  Utensils,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";

type OrderStatus =
  | "awaiting_payment"
  | "queued"
  | "cooking"
  | "ready"
  | "completed"
  | "cancelled";

interface IOrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IOrder;
}

// Status configuration
const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    message: string;
    progress: number;
  }
> = {
  awaiting_payment: {
    label: "Awaiting Payment",
    icon: CreditCard,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    message:
      "Please go to the counter and pay for your order to confirm and start preparation.",
    progress: 0,
  },
  queued: {
    label: "In Queue",
    icon: ClockIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    message:
      "Your order is in the queue and will be prepared shortly.",
    progress: 25,
  },
  cooking: {
    label: "Cooking",
    icon: Utensils,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    message: "Your order is being prepared with care by our chefs.",
    progress: 50,
  },
  ready: {
    label: "Ready for Pickup",
    icon: Package,
    color: "text-green-600",
    bgColor: "bg-green-100",
    message: "Your order is ready! Please pick it up at the counter.",
    progress: 100,
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-700",
    bgColor: "bg-green-100",
    message:
      "Your order has been completed. Thank you for dining with us!",
    progress: 100,
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    message:
      "Your order has been cancelled. Please contact the restaurant for more information.",
    progress: 0,
  },
};

// Status flow for tracking
const STATUS_FLOW: OrderStatus[] = [
  "awaiting_payment",
  "queued",
  "cooking",
  "ready",
  "completed",
];

export default function OrderSummeryPage() {
  const { orderId } = useParams();

  const { data, isLoading, isError, refetch } =
    useFetchById<IOrderResponse>("/orders", orderId as string);

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold mb-2">
            Failed to load order
          </h3>
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

  const currentStatus = order?.status as OrderStatus;
  const statusConfig =
    STATUS_CONFIG[currentStatus] || STATUS_CONFIG.awaiting_payment;
  const StatusIcon = statusConfig.icon;

  // Check if order is cancelled
  const isCancelled = currentStatus === "cancelled";
  const isCompleted = currentStatus === "completed";

  const formatEstimatedTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const estimatedTimeFormatted = formatEstimatedTime(
    order.estimatedCompletionAt,
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
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
          {/* Status Badge in Header */}
          <Badge
            className={`${statusConfig.bgColor} ${statusConfig.color} border-0 px-3 py-1.5 text-xs font-bold`}
          >
            <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
            {statusConfig.label}
          </Badge>
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
            style={{
              background: isCancelled
                ? "var(--destructive)"
                : isCompleted
                  ? "var(--green-500)"
                  : "var(--gradient-primary)",
            }}
          />

          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-6 sm:p-8">
              {/* Status Section */}
              <div className="text-center">
                {/* Status Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    delay: 0.1,
                  }}
                  className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}
                >
                  <StatusIcon className="h-10 w-10" />
                </motion.div>

                <h2 className="mt-4 text-2xl font-extrabold">
                  {statusConfig.label}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {statusConfig.message}
                </p>
                {order.orderType && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.orderType === "dine-in"
                      ? "Dine In"
                      : "Take Out"}{" "}
                    · Table {order.tableNumber}
                  </p>
                )}
              </div>

              {/* Status Progress Tracker */}
              {/* Status Progress Tracker */}
              {!isCancelled && !isCompleted && (
                <div className="mt-8">
                  <div className="relative flex justify-between items-start">
                    {STATUS_FLOW.map((status, index) => {
                      const config = STATUS_CONFIG[status];
                      const isActive = currentStatus === status;
                      const isPast =
                        STATUS_FLOW.indexOf(currentStatus) > index;
                      const Icon = config.icon;

                      return (
                        <div
                          key={status}
                          className="flex flex-col items-center flex-1 relative"
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all z-10 ${
                                isActive || isPast
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted bg-muted text-muted-foreground"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <span
                              className={`mt-2 text-[10px] font-medium text-center ${
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {config.label}
                            </span>
                          </div>
                          {/* Connector line */}
                          {index < STATUS_FLOW.length - 1 && (
                            <div
                              className={`absolute top-5 left-[calc(50%+20px)] h-0.5 w-[calc(100%-40px)] ${
                                STATUS_FLOW.indexOf(currentStatus) >
                                index
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancelled Status */}
              {isCancelled && (
                <div className="mt-8 rounded-2xl bg-red-50 p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    This order has been cancelled.
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Please contact the restaurant for more
                    information.
                  </p>
                </div>
              )}

              {/* Completed Status */}
              {isCompleted && (
                <div className="mt-8 rounded-2xl bg-green-50 p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    Order completed successfully!
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    Thank you for dining with us. We hope to see you
                    again!
                  </p>
                </div>
              )}

              {/* Countdown - Only show for active orders */}
              {!isCancelled &&
                !isCompleted &&
                currentStatus !== "awaiting_payment" && (
                  <div className="mt-6">
                    <Countdown
                      estimatedCompletionAt={
                        order.estimatedCompletionAt
                      }
                      orderNumber={order.orderNumber}
                    />
                  </div>
                )}

              {/* Order Details */}
              <div className="mt-6 rounded-2xl bg-muted/60 p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Order ID
                  </span>
                  <span className="font-extrabold tracking-wider">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Status
                  </span>
                  <Badge
                    className={`${statusConfig.bgColor} ${statusConfig.color} border-0 text-xs font-bold`}
                  >
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-extrabold">
                    ${order.grandTotal.toFixed(2)}
                  </span>
                </div>
                {order.orderPreparationTime &&
                  !isCancelled &&
                  !isCompleted && (
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
                {estimatedTimeFormatted &&
                  !isCancelled &&
                  !isCompleted &&
                  currentStatus !== "awaiting_payment" && (
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
                          Qty: {item.quantity} × $
                          {item.effectiveUnitPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm font-extrabold">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Note for Awaiting Payment */}
              {currentStatus === "awaiting_payment" && (
                <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-center border-2 border-yellow-200">
                  <CreditCard className="h-8 w-8 text-yellow-600 mx-auto" />
                  <p className="mt-2 text-sm font-semibold text-yellow-800">
                    Please proceed to the counter to complete your
                    payment.
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Your order will be prepared once payment is
                    confirmed.
                  </p>
                </div>
              )}

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
