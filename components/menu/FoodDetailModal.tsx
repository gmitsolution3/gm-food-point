import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-store";
import { IMenuItem } from "@/types";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  item: IMenuItem | null;
  setSelected: Dispatch<SetStateAction<IMenuItem | null>>;
  onClose: () => void;
}

export default function FoodDetailModal({ item, setSelected, onClose }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item) {
      setQty(1);
    }
  }, [item]);

  const suggested = item?.suggestedItems || [];

  const unit = item ? (item.discountPrice ?? item.price) : 0;

  const handleAdd = () => {
    if (!item) return;
    addItem(item, qty);
    onClose();
  };

  const isAvailable = item?.isAvailable ?? true;
  const categoryName = item?.categoryId?.name || "Uncategorized";
  const imageUrl = item?.image || "/placeholder-image.jpg";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-card shadow-[var(--shadow-lift)] sm:rounded-3xl"
          >
            <Button
              onClick={onClose}
              aria-label="Close"
              variant="ghost"
              className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-card/90 text-foreground shadow-[var(--shadow-soft)] backdrop-blur p-0 transition-transform hover:scale-105"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="overflow-y-auto">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={item.name}
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
                {!isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Badge className="rounded-full px-4 py-2 text-sm font-bold bg-red-500">
                      Unavailable
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <div>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                  >
                    {categoryName}
                  </Badge>
                  <h2 className="mt-3 text-3xl font-extrabold text-foreground">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {item.preparationTime && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      ⏱ Preparation time: {item.preparationTime} mins
                    </p>
                  )}
                  <div className="mt-4 flex items-baseline gap-3">
                    {item.discountPrice ? (
                      <>
                        <span className="text-3xl font-extrabold text-foreground">
                          ${item.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-foreground">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {suggested.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-bold tracking-wider uppercase text-muted-foreground">
                      You may also like
                    </h3>
                    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {suggested.map((s) => (
                        <motion.div
                          key={s._id}
                          whileHover={{ y: -4 }}
                          className="w-36 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-soft)]"
                          onClick={() => setSelected(s)}
                        >
                          <img
                            src={s.image || "/placeholder-image.jpg"}
                            alt={s.name}
                            className="h-24 w-full object-cover"
                          />
                          <div className="p-2">
                            <div className="truncate text-xs font-bold">
                              {s.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              $
                              {(s.discountPrice ?? s.price).toFixed(
                                2,
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3 rounded-full bg-muted p-1.5">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-[var(--shadow-soft)]"
                  disabled={!isAvailable}
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <motion.span
                  key={qty}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="min-w-8 text-center text-lg font-extrabold"
                >
                  {qty}
                </motion.span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-yellow)]"
                  disabled={!isAvailable}
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
              <motion.button
                whileHover={isAvailable ? { scale: 1.02 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
                onClick={handleAdd}
                disabled={!isAvailable}
                className={`flex flex-1 items-center justify-center gap-3 rounded-full px-6 py-4 text-base font-extrabold shadow-[var(--shadow-lift)] ${
                  isAvailable
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted-foreground/50 text-muted-foreground cursor-not-allowed opacity-50"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {isAvailable
                  ? `Add to Cart — $${(unit * qty).toFixed(2)}`
                  : "Unavailable"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
