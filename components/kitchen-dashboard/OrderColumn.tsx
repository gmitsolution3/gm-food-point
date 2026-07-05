// components/kitchen/OrderColumn.tsx
import {Badge} from "@/components/ui/badge";
import { Order, OrderCard } from "./OrderCard";

interface OrderColumnProps {
  title: string;
  orders: Order[];
  onAction: (order: Order) => void;
  actionLabel: string;
  actionColor?: string;
  variant: "queued" | "cooking" | "ready";
  icon?: React.ReactNode;
}

export function OrderColumn({
  title,
  orders,
  onAction,
  actionLabel,
  actionColor,
  variant,
  icon,
}: OrderColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-200">
        {icon}
        <h2 className="text-lg font-semibold text-gray-800">
          {title}
        </h2>
        <Badge variant="outline" className="ml-auto bg-gray-200 text-gray-700 hover:bg-gray-200">
          {orders.length}
        </Badge>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No orders in this column
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onAction={onAction}
              actionLabel={actionLabel}
              actionColor={actionColor}
              variant={variant}
            />
          ))
        )}
      </div>
    </div>
  );
}
