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
import { zodResolver } from "@hookform/resolvers/zod";
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
  UserIcon,
  UtensilsCrossed,
  Phone,
  Clock,
  MapPin
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type Fulfillment = "dine-in" | "pickup" | "delivery";
type Payment = "cash" | "card" | "mobile";

// Zod schema for validation
const checkoutSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(80, "Name is too long (max 80 characters)"),
    phone: z.string().optional(),
    fulfillment: z.enum(["dine-in", "pickup", "delivery"]),
    table: z.string().optional(),
    pickupTime: z.string().default("asap"),
    address: z.string().optional(),
    notes: z
      .string()
      .max(240, "Notes cannot exceed 240 characters")
      .default(""),
    payment: z.enum(["cash", "card", "mobile"]),
  })
  .superRefine((data, ctx) => {
    // Conditional validation
    if (data.fulfillment !== "dine-in") {
      if (
        !data.phone ||
        !/^[+()\-\s\d]{7,20}$/.test(data.phone.trim())
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid phone number",
          path: ["phone"],
        });
      }
    }

    if (data.fulfillment === "dine-in") {
      if (!data.table || data.table.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Table number is required",
          path: ["table"],
        });
      }
    }

    if (data.fulfillment === "delivery") {
      if (!data.address || data.address.trim().length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Please enter a full address (minimum 8 characters)",
          path: ["address"],
        });
      }
    }
  });

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, tax, total, orderType, clear } =
    useCart();

  const defaultFulfillment: Fulfillment =
    orderType === "dine-in" ? "dine-in" : "pickup";

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { orderId: string }>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<
    z.input<typeof checkoutSchema>,
    any,
    z.output<typeof checkoutSchema>
  >({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      fulfillment: defaultFulfillment,
      table: "",
      pickupTime: "asap",
      address: "",
      notes: "",
      payment: "card",
    },
  });

  const formValues = watch();
  const currentFulfillment = watch("fulfillment");
  const currentPayment = watch("payment");

  const deliveryFee = 3.5; // Fixed for now, could be dynamic
  const grandTotal =
    total +
    (formValues?.fulfillment === "delivery" ? deliveryFee : 0);

  const onSubmit = async (data: CheckoutFormData) => {
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
        fulfillment={currentFulfillment || defaultFulfillment}
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

      <form onSubmit={handleSubmit(onSubmit)}>
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
                <Controller
                  name="fulfillment"
                  control={control}
                  render={({ field }) => (
                    <>
                      <FulFillmentOption
                        active={field.value === "dine-in"}
                        onClick={() => field.onChange("dine-in")}
                        Icon={UtensilsCrossed}
                        title="Dine In"
                        desc="Eat at our restaurant"
                      />
                      <FulFillmentOption
                        active={field.value === "pickup"}
                        onClick={() => field.onChange("pickup")}
                        Icon={ShoppingBag}
                        title="Pickup"
                        desc="Grab it at the counter"
                      />
                      <FulFillmentOption
                        active={field.value === "delivery"}
                        onClick={() => field.onChange("delivery")}
                        Icon={Truck}
                        title="Delivery"
                        desc="Bring it to me · $3.50"
                      />
                    </>
                  )}
                />
              </div>
            </CheckoutCard>

            {/* Contact Details */}
            <CheckoutCard title="Your details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <CheckoutField
                      label="Full name"
                      Icon={UserIcon}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Jane Doe"
                      error={errors.name?.message}
                      maxLength={80}
                    />
                  )}
                />
                {currentFulfillment !== "dine-in" && (
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <CheckoutField
                        label="Phone"
                        Icon={Phone}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="+1 555 123 4567"
                        error={errors.phone?.message}
                        maxLength={20}
                        inputMode="tel"
                      />
                    )}
                  />
                )}
              </div>
            </CheckoutCard>

            {/* Conditional fulfillment details */}
            <motion.div
              key={currentFulfillment}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {currentFulfillment === "dine-in" && (
                <CheckoutCard title="Table">
                  <Controller
                    name="table"
                    control={control}
                    render={({ field }) => (
                      <CheckoutField
                        label="Table number"
                        Icon={Hash}
                        value={field.value || ""}
                        onChange={(v) =>
                          field.onChange(
                            v
                              .replace(/[^0-9A-Za-z]/g, "")
                              .slice(0, 6),
                          )
                        }
                        placeholder="e.g. 12"
                        error={errors.table?.message}
                        maxLength={6}
                      />
                    )}
                  />
                </CheckoutCard>
              )}

              {currentFulfillment === "pickup" && (
                <CheckoutCard title="Pickup time">
                  <div className="grid gap-2 sm:grid-cols-4">
                    {[
                      { v: "asap", l: "ASAP · 15 min" },
                      { v: "30", l: "In 30 min" },
                      { v: "60", l: "In 1 hour" },
                      { v: "120", l: "In 2 hours" },
                    ].map((opt) => {
                      const isActive =
                        formValues.pickupTime === opt.v;
                      return (
                        <motion.button
                          key={opt.v}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            setValue("pickupTime", opt.v)
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-sm font-bold transition-colors"
                          style={{
                            borderColor: isActive
                              ? "var(--primary)"
                              : "var(--border)",
                            background: isActive
                              ? "var(--primary)"
                              : "var(--card)",
                            color: isActive
                              ? "var(--primary-foreground)"
                              : "var(--foreground)",
                          }}
                        >
                          <Clock className="h-4 w-4" />
                          {opt.l}
                        </motion.button>
                      );
                    })}
                  </div>
                </CheckoutCard>
              )}

              {currentFulfillment === "delivery" && (
                <CheckoutCard title="Delivery address">
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <CheckoutField
                        label="Street address"
                        Icon={MapPin}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="123 Sunset Blvd, Apt 4B, Springfield"
                        error={errors.address?.message}
                        maxLength={160}
                      />
                    )}
                  />
                </CheckoutCard>
              )}
            </motion.div>

            {/* Payment */}
            <CheckoutCard
              title="Payment method"
              subtitle="You won't be charged until you place the order."
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Controller
                  name="payment"
                  control={control}
                  render={({ field }) => (
                    <>
                      <PaymentOption
                        active={field.value === "card"}
                        onClick={() => field.onChange("card")}
                        Icon={CreditCard}
                        title="Card"
                        desc="Visa, MC, Amex"
                      />
                      <PaymentOption
                        active={field.value === "mobile"}
                        onClick={() => field.onChange("mobile")}
                        Icon={Smartphone}
                        title="Mobile Pay"
                        desc="Apple / Google Pay"
                      />
                      <PaymentOption
                        active={field.value === "cash"}
                        onClick={() => field.onChange("cash")}
                        Icon={Banknote}
                        title="Cash"
                        desc="Pay on arrival"
                      />
                    </>
                  )}
                />
              </div>
            </CheckoutCard>

            {/* Notes */}
            <CheckoutCard
              title="Notes"
              subtitle="Optional — allergies, instructions, etc."
            >
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <>
                    <Textarea
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(e.target.value.slice(0, 240))
                      }
                      placeholder="No onions, ring the doorbell twice..."
                      rows={5}
                      className="w-full resize-none rounded-2xl border-border bg-card p-4 text-sm outline-none transition-shadow focus:shadow-[var(--shadow-soft)] focus:ring-2 focus:ring-primary/40 h-[150px]"
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>{errors.notes?.message ?? ""}</span>
                      <span>{(field.value || "").length}/240</span>
                    </div>
                  </>
                )}
              />
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
                  {items.length}{" "}
                  {items.length === 1 ? "item" : "items"}
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
                {currentFulfillment === "delivery" && (
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
                  type="submit"
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
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
      </form>
    </main>
  );
}
