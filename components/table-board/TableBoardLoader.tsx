import { motion } from "motion/react";
import { Card } from "../ui/card";

function TableSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="relative overflow-hidden border-2 p-8 text-center">
            {/* Status bar skeleton */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gray-200 dark:bg-gray-700 animate-pulse" />

            <div className="flex flex-col items-center gap-4 pt-2">
              {/* Table Number skeleton */}
              <div className="h-14 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />

              {/* Status Badge skeleton */}
              <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />

              {/* ID skeleton */}
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default function TableBoardLoader() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background px-6 py-12">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-40 blur-3xl bg-primary/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl bg-primary/10"
      />

      <div className="w-full max-w-7xl">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          {/* Logo Skeleton */}
          <div className="mb-6 flex justify-center">
            <div className="h-48 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Title Skeleton */}
          <div className="h-14 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />

          {/* Description Skeleton */}
          <div className="mx-auto mt-4 h-5 w-72 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

          {/* Stats Skeleton */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Table Grid Skeleton */}
        <TableSkeleton />
      </div>
    </main>
  );
}
