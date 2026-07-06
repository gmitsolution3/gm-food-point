"use client";

import CartEmpty from "@/components/checkout/CartEmpty";
import CheckoutCard from "@/components/checkout/CheckoutCard";
import CheckoutField from "@/components/checkout/CheckoutField";
import OrderTypeOption from "@/components/checkout/OrderType";
import PaymentOption from "@/components/checkout/PaymentOption";
import SummaryRow from "@/components/checkout/SummeryRow";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { usePost } from "@/hooks/swr/usePost";
import { useCart } from "@/store/cart-store";
import { IOrder, IPayment } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Hash,
  Loader2,
  MessageCircleMore,
  ShieldCheck,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type OrderType = "dine-in" | "take-out";

interface IOrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: { order: IOrder; payment: IPayment };
}

// Zod schema for validation
const checkoutSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),
  notes: z
    .string()
    .max(240, "Notes cannot exceed 240 characters")
    .default(""),
  payment: z.enum(["cash", "wechat"]),
  orderType: z.enum(["dine-in", "take-out"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const {
    mutate: placeOrder,
    isLoading,
    isError,
    data: orderData,
  } = usePost<IOrderResponse>("/orders");

  const {
    items,
    subtotal,
    discount,
    tax,
    taxPercentage,
    serviceCharge,
    serviceChargePercentage,
    total,
    orderType,
    clear,
  } = useCart();

  const defaultOrderType: OrderType =
    orderType === "dine-in" ? "dine-in" : "take-out";

  const [done, setDone] = useState<null | IOrder>(null);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<
    z.input<typeof checkoutSchema>,
    any,
    z.output<typeof checkoutSchema>
  >({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      tableNumber: "15",
      notes: "",
      payment: "cash",
      orderType: defaultOrderType,
    },
  });

  const grandTotal = total;

  const onSubmit = async (data: CheckoutFormData) => {
    const transformedItems = items.map((item) => ({
      menuId: item.item._id,
      quantity: item.quantity,
    }));

    const orderPayload = {
      ...data,
      paymentMethod: data.payment,
      createdBy: "customer",
      tableNumber: Number(data.tableNumber),
      items: transformedItems,
    };

    const response = await placeOrder(orderPayload);

    console.log(response);

    if (response?.success) {
      router.push(`/order-summery/${response?.data?.order?._id}`);
      setDone(response?.data?.order);
      clear();
    }
  };

  if (items.length === 0 && !done) {
    return <CartEmpty />;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold mb-2">
            Failed to place order
          </h3>
          <p className="text-muted-foreground">
            Please try again later
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </div>
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
            {/* Order Type */}
            <CheckoutCard
              title="Order type"
              subtitle="How would you like to enjoy your meal?"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Controller
                  name="orderType"
                  control={control}
                  render={({ field }) => (
                    <>
                      <OrderTypeOption
                        active={field.value === "dine-in"}
                        onClick={() => field.onChange("dine-in")}
                        Icon={UtensilsCrossed}
                        title="Dine In"
                        desc="Enjoy at our restaurant"
                      />
                      <OrderTypeOption
                        active={field.value === "take-out"}
                        onClick={() => field.onChange("take-out")}
                        Icon={ShoppingBag}
                        title="Take Out"
                        desc="Grab your order to go"
                      />
                    </>
                  )}
                />
              </div>
            </CheckoutCard>

            {/* Table Number */}
            <CheckoutCard title="Table number">
              <Controller
                name="tableNumber"
                control={control}
                render={({ field }) => (
                  <CheckoutField
                    label="Table number"
                    Icon={Hash}
                    value={field.value}
                    onChange={(v) =>
                      field.onChange(
                        v.replace(/[^0-9A-Za-z]/g, "").slice(0, 6),
                      )
                    }
                    placeholder="e.g. 12"
                    error={errors.tableNumber?.message}
                    maxLength={6}
                  />
                )}
              />
            </CheckoutCard>

            {/* Payment */}
            <CheckoutCard
              title="Payment method"
              subtitle="You won't be charged until you place the order."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Controller
                  name="payment"
                  control={control}
                  render={({ field }) => (
                    <>
                      <PaymentOption
                        active={field.value === "cash"}
                        onClick={() => field.onChange("cash")}
                        Icon={Banknote}
                        title="Cash"
                        desc="Pay on counter"
                      />
                      <PaymentOption
                        active={field.value === "wechat"}
                        onClick={() => field.onChange("wechat")}
                        Icon={MessageCircleMore}
                        title="WeChat Pay"
                        desc="Pay via WeChat"
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
                      placeholder="No onions, extra napkins, special requests..."
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
                  const unit = ci.item.discountPrice ?? ci.item.price;
                  return (
                    <li key={ci.lineId} className="flex gap-3">
                      <img
                        src={
                          ci.item.image || "/placeholder-image.jpg"
                        }
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
                {tax > 0 && (
                  <SummaryRow
                    label={`Tax (${taxPercentage}%)`}
                    value={tax}
                  />
                )}
                {serviceCharge > 0 && (
                  <SummaryRow
                    label={`Service Charge (${serviceChargePercentage}%)`}
                    value={serviceCharge}
                  />
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
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  disabled={isLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-extrabold text-primary-foreground shadow-[var(--shadow-yellow)] disabled:opacity-70"
                >
                  {isLoading ? (
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
