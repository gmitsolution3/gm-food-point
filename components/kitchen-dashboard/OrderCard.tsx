// components/kitchen/OrderCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Utensils, CheckCircle2, ChefHat, Coffee } from "lucide-react";

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  tableNumber: number;
  status: "queued" | "cooking" | "ready";
  orderPreparationTime: number;
  estimatedCompletionAt: string;
  notes: string;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  onAction: (order: Order) => void;
  actionLabel: string;
  actionColor?: string;
  icon?: React.ReactNode;
  variant?: "queued" | "cooking" | "ready";
}

const getStatusColors = (status: Order["status"]) => {
  switch (status) {
    case "queued":
      return "bg-yellow-50 hover:shadow-yellow-100/50";
    case "cooking":
      return "bg-blue-50 hover:shadow-blue-100/50";
    case "ready":
      return "bg-green-50 hover:shadow-green-100/50";
    default:
      return "bg-gray-50";
  }
};

const getStatusBadge = (status: Order["status"]) => {
  switch (status) {
    case "queued":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Queued</Badge>;
    case "cooking":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Cooking</Badge>;
    case "ready":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "queued":
      return <Clock className="w-4 h-4" />;
    case "cooking":
      return <ChefHat className="w-4 h-4" />;
    case "ready":
      return <Coffee className="w-4 h-4" />;
    default:
      return null;
  }
};

export function OrderCard({ 
  order, 
  onAction, 
  actionLabel, 
  actionColor = "bg-green-500 hover:bg-green-600",
  variant = "queued"
}: OrderCardProps) {
  const statusColor = getStatusColors(order.status);
  const statusBadge = getStatusBadge(order.status);
  const statusIcon = getStatusIcon(order.status);

  // Calculate waiting time (for queued orders)
  const getWaitingTime = () => {
    const now = new Date();
    const estimated = new Date(order.estimatedCompletionAt);
    const diffMs = estimated.getTime() - now.getTime();
    if (diffMs <= 0) return "0m 0s";
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className={`${statusColor} border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {statusIcon}
            <span className="font-bold text-lg text-gray-800">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge}
            <Badge variant="outline" className="bg-white/50">
              <Users className="w-3 h-3 mr-1" />
              Table {order.tableNumber}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Items */}
        <div className="space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Utensils className="w-3 h-3 text-gray-500" />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="font-medium text-gray-600">x{item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Preparation Time */}
        <div className="flex items-center justify-between text-sm bg-white/50 p-2 rounded-md">
          <span className="text-gray-600">Prep Time</span>
          <span className="font-medium text-gray-800">{order.orderPreparationTime}m</span>
        </div>

        {/* Notes if any */}
        {order.notes && (
          <div className="text-xs text-gray-500 bg-white/50 p-2 rounded-md">
            📝 {order.notes}
          </div>
        )}

        {/* Estimated completion */}
        <div className="text-xs text-gray-500 w-full text-center pt-1">
          {variant === "queued" ? (
            <>Est. completion: {new Date(order.estimatedCompletionAt).toLocaleTimeString([], { hour12: true })}</>
          ) : variant === "cooking" ? (
            <>Started: {new Date().toLocaleTimeString([], { hour12: true })}</>
          ) : (
            <>Ready since: {new Date().toLocaleTimeString([], { hour12: true })}</>
          )}
        </div>
      </CardContent>

      {variant !== "ready" && <CardFooter className="pt-2">
        <Button
          onClick={() => onAction(order)}
          className={`w-full ${actionColor} text-white transition-all duration-200`}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      </CardFooter>}
    </Card>
  );
}