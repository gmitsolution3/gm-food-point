import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

type Fulfillment = "dine-in" | "pickup" | "delivery";

export default function Confirmation({
  orderId,
  fulfillment,
  total,
}: {
  orderId: string;
  fulfillment: Fulfillment;
  total: number;
}) {
  const message =
    fulfillment === "dine-in"
      ? "We'll bring your order to your table shortly."
      : fulfillment === "pickup"
        ? "We'll have it ready at the counter soon."
        : "Our courier will be on the way shortly.";
  return (
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
        <div className="p-8">
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

          <div className="mt-6 rounded-2xl bg-muted/60 p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-extrabold tracking-wider">
                {orderId}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">
                Total paid
              </span>
              <span className="font-extrabold">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/menu"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-yellow)]"
            >
              Order Again <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-secondary bg-card px-6 py-3.5 text-sm font-extrabold text-foreground"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
