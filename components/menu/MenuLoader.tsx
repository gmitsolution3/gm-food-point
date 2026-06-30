import { motion } from "motion/react";

export default function MenuLoader() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      variants={{
        show: { transition: { staggerChildren: 0.05 } },
      }}
      initial="hide"
      animate="show"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          variants={{
            hide: { opacity: 0, y: 16 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.25 },
            },
          }}
        >
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </motion.div>
      ))}
    </motion.div>
  );
}
