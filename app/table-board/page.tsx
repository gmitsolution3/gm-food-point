"use client";

import { useFetch } from "@/hooks/swr/useFetch";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";
import { Loader2, Table, Circle } from "lucide-react";

interface ITable {
  _id: string;
  tableNumber: number;
  status: "available" | "occupied";
  occupiedAt: string | null;
}

interface ITablesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ITable[];
}

export default function TableBoardPage() {
  const { data, isLoading, isError, refetch } = useFetch<ITablesResponse>(
    "/tables"
  );

  const tables = data?.data || [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading tables...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold mb-2">Failed to load tables</h3>
          <p className="text-muted-foreground">Please try again later</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const availableTables = tables.filter(t => t.status === "available");
  const occupiedTables = tables.filter(t => t.status === "occupied");

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
            <div className="relative h-48 w-48 overflow-hidden p-2 ">
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

          {/* Stats */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 fill-green-500 text-green-500" />
              <span className="text-muted-foreground">
                {availableTables.length} Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-muted-foreground">
                {occupiedTables.length} Occupied
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tables Grid */}
        {tables.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Table className="h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">No tables found</h3>
            <p className="text-sm text-muted-foreground">
              There are no tables available in the system.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tables.map((table, index) => {
              const isAvailable = table.status === "available";
              return (
                <motion.div
                  key={table._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 + index * 0.05 }}
                >
                  <Card
                    className={`group relative overflow-hidden border-2 p-8 text-center transition-all hover:shadow-[var(--shadow-lift)] ${
                      isAvailable
                        ? "border-green-500/50 bg-green-50/50 hover:border-green-500 dark:bg-green-950/20"
                        : "border-yellow-500/50 bg-yellow-50/50 hover:border-yellow-500 dark:bg-yellow-950/20"
                    }`}
                  >
                    {/* Status bar at top */}
                    <div
                      className={`absolute inset-x-0 top-0 h-1.5 ${
                        isAvailable ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />

                    <div className="flex flex-col items-center gap-4 pt-2">
                      {/* Table Number */}
                      <div className="text-5xl font-extrabold text-foreground">
                        {table.tableNumber}
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
                          isAvailable
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        <Circle className="h-2.5 w-2.5 fill-current" />
                        {isAvailable ? "Available" : "Occupied"}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}