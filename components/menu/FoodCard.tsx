import { Badge } from "@/components/ui/badge";
import { IMenuItem } from "@/types";
import { motion } from "motion/react";

interface IProps {
  item: IMenuItem;
  onView: (item: IMenuItem) => void;
}

export default function FoodCard({ item, onView }: IProps) {
  const hasDiscount =
    typeof item.discountPrice === "number" &&
    item.discountPrice !== null;
  const categoryName = item.categoryId?.name || "Uncategorized";
  const imageUrl = item.image || "/placeholder-image.jpg";

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <motion.img
          src={imageUrl}
          alt={item.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.3 }}
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
        >
          {categoryName}
        </Badge>
        {hasDiscount && (
          <Badge className="absolute top-3 right-3 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
            Save
          </Badge>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Badge className="rounded-full px-4 py-2 text-sm font-bold bg-red-500">
              Unavailable
            </Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-extrabold text-foreground">
            {item.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {item.description}
          </p>
          {item.preparationTime && (
            <p className="mt-1 text-xs text-muted-foreground">
              ⏱ {item.preparationTime} mins
            </p>
          )}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <div className="flex flex-col-reverse">
                <span className="text-lg font-extrabold text-foreground">
                  ${item.discountPrice!.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-muted-foreground line-through">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-extrabold text-foreground">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(item)}
            disabled={!item.isAvailable}
            className={`rounded-full px-4 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-yellow)] transition-colors ${
              item.isAvailable
                ? "bg-primary hover:bg-[var(--primary-glow)] cursor-pointer"
                : "bg-muted-foreground/50 cursor-not-allowed opacity-50"
            }`}
          >
            {item.isAvailable ? "View Details" : "Unavailable"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
