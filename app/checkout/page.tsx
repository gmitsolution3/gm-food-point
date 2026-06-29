"use client";

import CartEmpty from "@/components/checkout/CartEmpty";
import CheckoutCard from "@/components/checkout/CheckoutCard";
import CheckoutField from "@/components/checkout/CheckoutField";
import Confirmation from "@/components/checkout/Confirmation";
import FulFillmentOption from "@/components/checkout/FulFillmentOption";
import PaymentOption from "@/components/checkout/PaymentOption";
import SummaryRow from "@/components/checkout/SummeryRow";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/store/cart-store";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CreditCard,
  Hash,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Fulfillment = "dine-in" | "pickup" | "delivery";
type Payment = "cash" | "card" | "mobile";

interface FormState {
  name: string;
  phone: string;
  fulfillment: Fulfillment;
  table: string;
  pickupTime: string;
  address: string;
  notes: string;
  payment: Payment;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, tax, total, orderType, clear } =
    useCart();

  const defaultFulfillment: Fulfillment =
    orderType === "dine-in" ? "dine-in" : "pickup";

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    fulfillment: defaultFulfillment,
    table: "",
    pickupTime: "asap",
    address: "",
    notes: "",
    payment: "card",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { orderId: string }>(null);

  const deliveryFee = form.fulfillment === "delivery" ? 3.5 : 0;
  const grandTotal = total + deliveryFee;

  const update = <K extends keyof FormState>(
    k: K,
    v: FormState[K],
  ) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (form.name.length > 80) e.name = "Too long";
    if (form.fulfillment !== "dine-in") {
      if (!/^[+()\-\s\d]{7,20}$/.test(form.phone.trim()))
        e.phone = "Enter a valid phone";
    }
    if (form.fulfillment === "dine-in" && !form.table.trim())
      e.table = "Enter your table";
    if (
      form.fulfillment === "delivery" &&
      form.address.trim().length < 8
    )
      e.address = "Enter a full address";
    if (form.notes.length > 240) e.notes = "Max 240 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    const orderId =
      "GLD-" + Math.floor(100000 + Math.random() * 900000);
    setSubmitting(false);
    setDone({ orderId });
    clear();
  };

  if (items.length === 0 && !done) {
    return <CartEmpty />;
  }

  if (done) {
    return (
      <Confirmation
        orderId={done.orderId}
        fulfillment={form.fulfillment}
        total={grandTotal}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/menu"
            aria-label="Back"
            className="grid h-10 w-10 place-items-center rounded-full bg-muted hover:bg-secondary hover:text-secondary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <Badge
              variant="outline"
              className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground border-0 px-0"
            >
              Step 2 of 2
            </Badge>
            <h1 className="text-xl font-extrabold leading-tight">
              Checkout
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px]">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Fulfillment */}
          <CheckoutCard
            title="Order type"
            subtitle="How should we hand off your order?"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <FulFillmentOption
                active={form.fulfillment === "dine-in"}
                onClick={() => update("fulfillment", "dine-in")}
                Icon={UtensilsCrossed}
                title="Dine In"
                desc="Eat at our restaurant"
              />
              <FulFillmentOption
                active={form.fulfillment === "pickup"}
                onClick={() => update("fulfillment", "pickup")}
                Icon={ShoppingBag}
                title="Pickup"
                desc="Grab it at the counter"
              />
              <FulFillmentOption
                active={form.fulfillment === "delivery"}
                onClick={() => update("fulfillment", "delivery")}
                Icon={Truck}
                title="Delivery"
                desc="Bring it to me · $3.50"
              />
            </div>
          </CheckoutCard>

          {/* Table details */}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <CheckoutCard title="Table" subtitle="Your table number">
              <CheckoutField
                label="Table number"
                Icon={Hash}
                value={form.table}
                onChange={(v) =>
                  update(
                    "table",
                    v.replace(/[^0-9A-Za-z]/g, "").slice(0, 6),
                  )
                }
                placeholder="e.g. 12"
                error={errors.table}
                maxLength={6}
              />
            </CheckoutCard>
          </motion.div>

          {/* Payment */}
          <CheckoutCard
            title="Payment method"
            subtitle="You won't be charged until you place the order."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <PaymentOption
                active={form.payment === "card"}
                onClick={() => update("payment", "card")}
                Icon={CreditCard}
                title="Card"
                desc="Visa, MC, Amex"
              />
              <PaymentOption
                active={form.payment === "mobile"}
                onClick={() => update("payment", "mobile")}
                Icon={Smartphone}
                title="Mobile Pay"
                desc="Apple / Google Pay"
              />
              <PaymentOption
                active={form.payment === "cash"}
                onClick={() => update("payment", "cash")}
                Icon={Banknote}
                title="Cash"
                desc="Pay on arrival"
              />
            </div>
          </CheckoutCard>

          {/* Notes */}
          <CheckoutCard
            title="Notes"
            subtitle="Optional — allergies, instructions, etc."
          >
            <Textarea
              value={form.notes}
              onChange={(e) =>
                update("notes", e.target.value.slice(0, 240))
              }
              placeholder="No onions, ring the doorbell twice..."
              rows={5}
              className="w-full resize-none rounded-2xl border-border bg-card p-4 text-sm outline-none transition-shadow focus:shadow-[var(--shadow-soft)] focus:ring-2 focus:ring-primary/40 h-[150px]"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>{errors.notes ?? ""}</span>
              <span>{form.notes.length}/240</span>
            </div>
          </CheckoutCard>
        </motion.section>

        {/* Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="lg:sticky lg:top-24 lg:h-fit"
        >
          <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)]">
            <div className="border-b p-5">
              <h2 className="text-lg font-extrabold">
                Order summary
              </h2>
              <p className="text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <ul className="max-h-64 space-y-3 overflow-y-auto p-5">
              {items.map((ci) => {
                const unit =
                  (ci.item.discountPrice ?? ci.item.price) +
                  ci.addons.reduce((s, a) => s + a.price, 0);
                return (
                  <li key={ci.lineId} className="flex gap-3">
                    <img
                      src={ci.item.image as string}
                      alt={ci.item.name}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <span className="truncate text-sm font-bold">
                          {ci.item.name}
                        </span>
                        <span className="shrink-0 text-sm font-bold">
                          ${(unit * ci.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Qty {ci.quantity}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-1.5 border-t p-5 text-sm">
              <SummaryRow label="Subtotal" value={subtotal} />
              {discount > 0 && (
                <SummaryRow
                  label="Discount"
                  value={-discount}
                  accent
                />
              )}
              <SummaryRow label="Tax (8%)" value={tax} />
              {deliveryFee > 0 && (
                <SummaryRow label="Delivery" value={deliveryFee} />
              )}
              <div className="my-3 h-px bg-border" />
              <div className="flex items-end justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                  Grand Total
                </span>
                <motion.span
                  key={grandTotal.toFixed(2)}
                  initial={{ y: -4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-extrabold"
                >
                  ${grandTotal.toFixed(2)}
                </motion.span>
              </div>
              <motion.button
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                onClick={placeOrder}
                disabled={submitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-extrabold text-primary-foreground shadow-[var(--shadow-yellow)] disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />{" "}
                    Placing order...
                  </>
                ) : (
                  <>
                    Place Order <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure
                checkout · Demo only
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
