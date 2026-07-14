import { motion } from "motion/react";
import Image from "next/image";

export default function TableBoardError({
  refetch,
}: {
  refetch: () => void;
}) {
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="relative h-48 w-48 overflow-hidden p-2">
              <Image
                src="/images/logo.png"
                alt="GM Food Point Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
            Table Board
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
            View table availability on live
          </p>
        </motion.div>

        {/* Simple Error State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold mb-2">
            Failed to load tables
          </h3>
          <p className="text-muted-foreground">
            Please try again later
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    </main>
  );
}
