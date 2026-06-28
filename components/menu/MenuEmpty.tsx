import { motion } from "motion/react";

export default function MenuEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-3xl bg-card py-16 text-center shadow-[var(--shadow-soft)]"
    >
      <div className="mb-4 text-6xl">🍽️</div>
      <h3 className="text-xl font-extrabold">No food found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try a different category or search term.
      </p>
    </motion.div>
  );
}
