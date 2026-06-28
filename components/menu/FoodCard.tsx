import { IMenuItem } from "@/types";
import { motion } from "motion/react";

interface IProps {
  item: IMenuItem;
  onView: (item: IMenuItem) => void;
}

export default function FoodCard({ item, onView }: IProps) {
  const hasDiscount = typeof item.discountPrice === "number";
  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <motion.img
          src={item.image as string}
          alt={item.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.3 }}
        />
        <span className="absolute top-3 left-3 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold tracking-wider text-secondary-foreground uppercase">
          {item.category}
        </span>
        {hasDiscount && (
          <span className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
            Save
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-extrabold text-foreground">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-extrabold text-foreground">
                  ${item.discountPrice!.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-muted-foreground line-through">
                  ${item.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-extrabold text-foreground">${item.price.toFixed(2)}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(item)}
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-yellow)] transition-colors hover:bg-[var(--primary-glow)]"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}