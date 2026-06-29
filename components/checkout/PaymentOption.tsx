import { motion } from "motion/react";
import { ComponentType } from "react";

export default function PaymentOption({
  active,
  onClick,
  Icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  Icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-colors"
      style={{
        borderColor: active ? "var(--primary)" : "var(--border)",
        background: active ? "var(--accent)" : "var(--card)",
      }}
      type="button"
    >
      <div
        className="grid h-10 w-10 place-items-center rounded-xl"
        style={{
          background: active ? "var(--primary)" : "var(--muted)",
          color: active
            ? "var(--primary-foreground)"
            : "var(--foreground)",
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-extrabold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </motion.button>
  );
}
