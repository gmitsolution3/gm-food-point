import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-store";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function CartPanel({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    tax,
    total,
    orderType,
  } = useCart();
  const router = useRouter();

  return (
    <div
      className={`flex h-full flex-col bg-card ${embedded ? "" : "rounded-3xl shadow-[var(--shadow-soft)]"}`}
    >
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <Badge
            variant="outline"
            className="text-xs font-bold tracking-wider uppercase text-muted-foreground border-0 px-0"
          >
            {orderType === "take-out" ? "Take Out" : "Dine In"}
          </Badge>
          <h2 className="text-xl font-extrabold">Your Order</h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-yellow)]">
          <ShoppingBag className="h-5 w-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <div className="mb-3 text-5xl">🛒</div>
            <p className="text-sm font-semibold">
              Your cart is empty
            </p>
            <p className="text-xs">
              Add some delicious items to get started.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {items.map((ci) => {
                const unit =
                  (ci.item.discountPrice ?? ci.item.price) +
                  ci.addons.reduce((s, a) => s + a.price, 0);
                return (
                  <motion.li
                    key={ci.lineId}
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 28,
                    }}
                    className="flex gap-3 rounded-2xl bg-muted/60 p-3"
                  >
                    <img
                      src={ci.item.image as string}
                      alt={ci.item.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold">
                            {ci.item.name}
                          </div>
                          {ci.addons.length > 0 && (
                            <div className="truncate text-[11px] text-muted-foreground">
                              {ci.addons
                                .map((a) => a.name)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => removeItem(ci.lineId)}
                          variant="ghost"
                          size="icon"
                          className="shrink-0 rounded-full p-1.5 h-auto w-auto text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 rounded-full bg-card p-1 shadow-[var(--shadow-soft)]">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(
                                ci.lineId,
                                ci.quantity - 1,
                              )
                            }
                            className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </motion.button>
                          <motion.span
                            key={ci.quantity}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="min-w-5 text-center text-sm font-extrabold"
                          >
                            {ci.quantity}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(
                                ci.lineId,
                                ci.quantity + 1,
                              )
                            }
                            className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white!"
                          >
                            <Plus className="h-3 w-3" />
                          </motion.button>
                        </div>
                        <motion.span
                          key={unit * ci.quantity}
                          initial={{ y: -4, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-sm font-extrabold"
                        >
                          ${(unit * ci.quantity).toFixed(2)}
                        </motion.span>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <div className="border-t p-5">
        <dl className="space-y-1.5 text-sm">
          <Row label="Subtotal" value={subtotal} />
          {discount > 0 && (
            <Row label="Discount" value={-discount} accent />
          )}
          <Row label="Tax (8%)" value={tax} />
        </dl>
        <div className="my-3 h-px bg-border" />
        <div className="flex items-end justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
            Total
          </span>
          <motion.span
            key={total.toFixed(2)}
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-extrabold"
          >
            ${total.toFixed(2)}
          </motion.span>
        </div>
        <motion.button
          whileHover={{ scale: items.length ? 1.02 : 1 }}
          whileTap={{ scale: items.length ? 0.98 : 1 }}
          disabled={items.length === 0}
          onClick={() => router.push("/checkout")}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-extrabold text-primary-foreground shadow-[var(--shadow-yellow)] transition-opacity disabled:opacity-40"
        >
          Checkout
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`font-bold ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value < 0 ? "-" : ""}${Math.abs(value).toFixed(2)}
      </dd>
    </div>
  );
}
