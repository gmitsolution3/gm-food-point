import { ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function CartEmpty() {
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
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-muted text-muted-foreground"
          >
            <ShoppingBag className="h-10 w-10" />
          </motion.div>
          <h1 className="mt-6 text-3xl font-extrabold">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Looks like you haven't added any items yet.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-yellow)]"
          >
            Browse Menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
