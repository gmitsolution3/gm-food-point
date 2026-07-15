"use client";

import {
  ArrowRight,
  ChefHat,
  CreditCard,
  LayoutDashboard,
  Table2,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardsPage() {
  const dashboards = [
    {
      id: "manager",
      title: "Manager Dashboard",
      description: "Overview, analytics, and management controls",
      icon: LayoutDashboard,
      href: "/manager-dashboard",
    },
    {
      id: "cashier",
      title: "Cashier Dashboard",
      description: "Process orders and manage payments",
      icon: CreditCard,
      href: "/cashier-dashboard",
    },
    {
      id: "kitchen",
      title: "Kitchen Dashboard",
      description: "View and manage food preparation",
      icon: ChefHat,
      href: "/kitchen-dashboard",
    },
    {
      id: "table",
      title: "Table Board",
      description: "View table reservations and status",
      icon: Table2,
      href: "/table-board",
    },
    {
      id: "configuration",
      title: "Configuration Dashboard",
      description: "View table reservations and status",
      icon: Table2,
      href: "/configure",
    },
  ];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-40 blur-3xl bg-primary/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl bg-primary/10"
      />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 text-center"
      >
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative h-40 w-40 overflow-hidden p-2">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="GM Food Point Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </Link>
          </div>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Dashboards Manager
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
          Select a dashboard to access
        </p>
      </motion.div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        {dashboards.map((dashboard, i) => (
          <motion.div
            key={dashboard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
          >
            <Link href={dashboard.href}>
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <dashboard.icon
                    className="h-8 w-8"
                    strokeWidth={2}
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {dashboard.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dashboard.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/50 transition-colors group-hover:text-foreground">
                  Access{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
