"use client";

import CartPanel from "@/components/menu/CartPanel";
import CategoryTabs from "@/components/menu/Category/CategoryTab";
import FoodCard from "@/components/menu/FoodCard";
import FoodDetailModal from "@/components/menu/FoodDetailModal";
import MenuEmpty from "@/components/menu/MenuEmpty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/swr/useFetch";
import { useDebounce } from "@/hooks/useDebounce"; // You'll need to create this
import { useCart } from "@/store/cart-store";
import { IMenuItem } from "@/types";
import { ArrowLeft, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export interface IMenuResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IMenuItem[];
}

export default function MenuPage() {
  const [category, setCategory] = useState<string>("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<IMenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems, total, orderType } = useCart();

  // Debounce search query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 500);

  // Build query params
  const queryParams = new URLSearchParams({
    page: "1",
    limit: "100",
    categoryId: category,
    search: debouncedQuery,
  });

  const { data, isLoading, isError, refetch } =
    useFetch<IMenuResponse>(`/menus?${queryParams.toString()}`);

  const filtered = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              <div>
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="mt-1 h-6 w-48 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-5">
            <div className="h-12 w-full animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mb-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-11 w-20 animate-pulse rounded-full bg-muted"
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground border-0 px-0"
                >
                  {orderType === "take-out"
                    ? "Take Out Order"
                    : "Dine In Order"}
                </Badge>
                <h1 className="text-xl font-extrabold leading-tight">
                  GM Food Point Menu
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-sm font-semibold text-gray-900">
              Failed to load menu
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Something went wrong while fetching menu items
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-6 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <Badge
                variant="outline"
                className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground border-0 px-0"
              >
                {orderType === "take-out"
                  ? "Take Out Order"
                  : "Dine In Order"}
              </Badge>
              <h1 className="text-xl font-extrabold leading-tight">
                GM Food Point Menu
              </h1>
            </div>
          </div>

          {/* Mobile cart trigger */}
          <Button
            onClick={() => setCartOpen(true)}
            variant="secondary"
            className="relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold lg:hidden"
          >
            <ShoppingBag className="h-4 w-4" />${total.toFixed(2)}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-w-0"
        >
          {/* Search */}
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search food..."
              className="w-full rounded-full border-border bg-card py-6 pr-5 pl-12 text-sm font-medium shadow-[var(--shadow-soft)] outline-none transition-shadow focus:shadow-[var(--shadow-lift)] focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <CategoryTabs
              selectedCategory={category}
              onChange={setCategory}
            />
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={category + query}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.length === 0 ? (
                <MenuEmpty />
              ) : (
                <motion.div
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  variants={{
                    show: { transition: { staggerChildren: 0.05 } },
                  }}
                  initial="hide"
                  animate="show"
                >
                  {filtered.map((item) => (
                    <motion.div
                      key={item._id}
                      variants={{
                        hide: { opacity: 0, y: 16 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.25 },
                        },
                      }}
                    >
                      <FoodCard item={item} onView={setSelected} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Desktop Cart */}
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] lg:block">
          <CartPanel />
        </aside>
      </div>

      {/* Mobile floating cart button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setCartOpen(true)}
            className="fixed right-4 bottom-5 left-4 z-30 flex items-center justify-between rounded-full bg-secondary px-6 py-4 text-secondary-foreground shadow-[var(--shadow-lift)] lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-sm font-extrabold">
                {totalItems} items
              </span>
            </div>
            <span className="text-sm font-extrabold">
              View Cart · ${total.toFixed(2)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className="absolute inset-x-0 bottom-0 h-[88vh] overflow-hidden rounded-t-3xl bg-card"
            >
              <Button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                variant="ghost"
                className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-muted p-0"
              >
                <X className="h-5 w-5" />
              </Button>
              <CartPanel embedded />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FoodDetailModal
        item={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
