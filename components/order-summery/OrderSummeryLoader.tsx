// components/order/OrderSummarySkeleton.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";

export default function OrderSummaryLoader() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div>
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              <div className="h-6 w-32 bg-muted animate-pulse rounded mt-1" />
            </div>
          </div>
          <div className="h-8 w-32 bg-muted animate-pulse rounded-full" />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="w-full overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-lift)]"
        >
          <div className="h-2 bg-muted animate-pulse" />

          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-6 sm:p-8">
              {/* Status Icon Skeleton */}
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-muted animate-pulse" />
                <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto mt-4" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto mt-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded mx-auto mt-1" />
              </div>

              {/* Status Progress Tracker Skeleton */}
              <div className="mt-8">
                <div className="relative flex justify-between items-start">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1 relative"
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="h-3 w-16 bg-muted animate-pulse rounded mt-2" />
                      </div>
                      {index < 5 && (
                        <div className="absolute top-5 left-[calc(50%+20px)] h-0.5 w-[calc(100%-40px)] bg-muted animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Countdown Skeleton */}
              <div className="mt-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="h-32 w-32 mx-auto rounded-full border-4 border-muted animate-pulse" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded mt-1" />
                    </div>
                  </div>
                  <div className="h-3 w-32 bg-muted animate-pulse rounded mx-auto mt-2" />
                  <div className="h-4 w-48 bg-muted animate-pulse rounded mx-auto mt-4" />
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>

              {/* Order Details Skeleton */}
              <div className="mt-6 rounded-2xl bg-muted/60 p-4 space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded flex items-center gap-1" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex justify-between border-t border-border/50 pt-2 mt-1">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
              </div>

              {/* Order Items Skeleton */}
              <div className="mt-6">
                <div className="h-4 w-32 bg-muted animate-pulse rounded mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                    >
                      <div>
                        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-32 bg-muted animate-pulse rounded mt-1" />
                      </div>
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Skeleton */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="h-14 w-full bg-muted animate-pulse rounded-full" />
                <div className="h-14 w-full bg-muted animate-pulse rounded-full" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
