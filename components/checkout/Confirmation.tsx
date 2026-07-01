import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import CountdownModal from "./CountDownModal";

type OrderType = "dine-in" | "take-out";

export default function Confirmation({
  orderId,
  orderType,
  total,
  estimatedTime,
  estimatedCompletionAt,
}: {
  orderId: string;
  orderType: OrderType;
  total: number;
  estimatedTime?: number;
  estimatedCompletionAt?: string;
}) {
  const [showCountdown, setShowCountdown] = useState(false);

  // Format the estimated completion time
  const formatEstimatedTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const message =
    orderType === "dine-in"
      ? "We'll bring your order to your table shortly."
      : orderType === "take-out"
        ? "We'll have it ready at the counter soon."
        : "Our courier will be on the way shortly.";

  const estimatedTimeFormatted = formatEstimatedTime(
    estimatedCompletionAt,
  );

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="w-full max-w-md overflow-hidden rounded-3xl bg-card text-center shadow-[var(--shadow-lift)]"
        >
          <div
            aria-hidden
            className="h-2"
            style={{ background: "var(--gradient-primary)" }}
          />
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-8">
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
              <h1 className="mt-6 text-3xl font-extrabold">
                Order placed!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {message}
              </p>

              <div className="mt-6 rounded-2xl bg-muted/60 p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Order ID
                  </span>
                  <span className="font-extrabold tracking-wider">
                    {orderId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-extrabold">
                    ${total.toFixed(2)}
                  </span>
                </div>
                {estimatedTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Prep Time
                    </span>
                    <span className="font-extrabold">
                      ~{estimatedTime} mins
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

              <div className="mt-6 flex flex-col gap-2">
                {/* Track Order Button */}
                {estimatedCompletionAt && (
                  <button
                    onClick={() => setShowCountdown(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-extrabold text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    <Clock className="h-4 w-4" />
                    Track Order
                  </button>
                )}

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
      </main>

      {/* Countdown Modal */}
      {estimatedCompletionAt && (
        <CountdownModal
          isOpen={showCountdown}
          estimatedCompletionAt={estimatedCompletionAt}
          onClose={() => setShowCountdown(false)}
          orderNumber={orderId}
        />
      )}
    </>
  );
}
