import { MENU } from "@/lib/menu-data";
import { useCart } from "@/store/cart-store";
import { IAddOn, IMenuItem } from "@/types";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  item: IMenuItem | null;
  onClose: () => void;
}

export default function FoodDetailModal({ item, onClose }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (item) {
      setQty(1);
      setSelected({});
    }
  }, [item]);

  const suggested = useMemo(
    () =>
      item ? MENU.filter((m) => m.id !== item.id).slice(0, 6) : [],
    [item],
  );

  const selectedAddons: IAddOn[] = useMemo(() => {
    if (!item) return [];
    return item.addons.filter((a) => selected[a.id]);
  }, [item, selected]);

  const unit = item
    ? (item.discountPrice ?? item.price) +
      selectedAddons.reduce((s, a) => s + a.price, 0)
    : 0;

  const handleAdd = () => {
    if (!item) return;
    addItem(item, qty, selectedAddons);
    onClose();
  };

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
                  src={item.image as string}
                  alt={item.name}
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <div>
                  <Badge 
                    variant="secondary" 
                    className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                  >
                    {item.category}
                  </Badge>
                  <h2 className="mt-3 text-3xl font-extrabold text-foreground">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
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

                {item.addons.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-bold tracking-wider uppercase text-muted-foreground">
                      Add-ons
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {item.addons.map((a) => {
                        const on = !!selected[a.id];
                        return (
                          <motion.label
                            key={a.id}
                            whileTap={{ scale: 0.98 }}
                            className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-card px-4 py-3 transition-colors"
                            style={{
                              borderColor: on
                                ? "var(--primary)"
                                : "var(--border)",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={on}
                                onCheckedChange={() =>
                                  setSelected((s) => ({
                                    ...s,
                                    [a.id]: !on,
                                  }))
                                }
                                className="h-5 w-5"
                              />
                              <span className="text-sm font-semibold text-foreground">
                                {a.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-foreground">
                              +${a.price.toFixed(2)}
                            </span>
                          </motion.label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-3 text-sm font-bold tracking-wider uppercase text-muted-foreground">
                    You may also like
                  </h3>
                  <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {suggested.map((s) => (
                      <motion.div
                        key={s.id}
                        whileHover={{ y: -4 }}
                        className="w-36 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-soft)]"
                      >
                        <img
                          src={s.image as string}
                          alt={s.name}
                          className="h-24 w-full object-cover"
                        />
                        <div className="p-2">
                          <div className="truncate text-xs font-bold">
                            {s.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${(s.discountPrice ?? s.price).toFixed(2)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3 rounded-full bg-muted p-1.5">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-[var(--shadow-soft)]"
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
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                className="flex flex-1 items-center justify-center gap-3 rounded-full bg-secondary px-6 py-4 text-base font-extrabold text-secondary-foreground shadow-[var(--shadow-lift)]"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart — ${(unit * qty).toFixed(2)}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}