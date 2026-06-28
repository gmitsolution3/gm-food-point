import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartEmpty() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-sm rounded-3xl bg-card p-8 text-center shadow-[var(--shadow-soft)]">
        <div className="mb-4 text-5xl">🛒</div>
        <h1 className="text-2xl font-extrabold">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a few items before heading to checkout.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-yellow)]"
        >
          Browse Menu <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
