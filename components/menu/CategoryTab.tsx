import { CATEGORIES } from "@/lib/menu-data";
import { motion } from "motion/react";

interface IProps {
  active: string;
  onChange: (c: string) => void;
}

export default function CategoryTabs({ active, onChange }: IProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((c) => {
        const isActive = active === c;
        return (
          <motion.button
            key={c}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(c)}
            className="relative shrink-0 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-colors"
            style={{
              borderColor: isActive
                ? "var(--primary)"
                : "var(--border)",
              color: isActive
                ? "var(--primary-foreground)"
                : "var(--foreground)",
            }}
          >
            {isActive && (
              <motion.span
                layoutId="active-cat"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                }}
              />
            )}
            <span className="relative z-10">{c}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
