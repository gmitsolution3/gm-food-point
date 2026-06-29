"use client";

import { useCart } from "@/store/cart-store";
import {
  ArrowRight,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { setOrderType } = useCart();
  const router = useRouter();

  const choose = (type: "dine-in" | "take-out") => {
    setOrderType(type);
    router.push("/menu");
  };

  const options = [
    {
      type: "dine-in" as const,
      title: "Dine In",
      desc: "Enjoy your meal at our cozy table.",
      Icon: UtensilsCrossed,
      emoji: "🍽",
    },
    {
      type: "take-out" as const,
      title: "Take Out",
      desc: "Grab your order and go.",
      Icon: ShoppingBag,
      emoji: "🥡",
    },
  ];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-40 blur-3xl gradient-primary"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl gradient-primary"
      />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 text-center"
      >
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative h-40 w-40 overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="GM Food Point Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
        </div>

        <Badge 
          variant="secondary" 
          className="mb-4 inline-flex items-center gap-2 rounded-full p-4 text-xs font-semibold tracking-wider uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Welcome to GM Food Point
        </Badge>

        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          How would you like to order?
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
          Choose your experience to get started.
        </p>
      </motion.div>

      <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2">
        {options.map((opt, i) => (
          <motion.button
            key={opt.type}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.1 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => choose(opt.type)}
            className="group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-card p-10 text-left shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5 gradient-primary"
            />
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-yellow)]">
              <opt.Icon className="h-12 w-12" strokeWidth={2.2} />
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-foreground">
                {opt.emoji} {opt.title}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {opt.desc}
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/70 transition-colors group-hover:text-foreground">
              Continue{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.button>
        ))}
      </div>
    </main>
  );
}