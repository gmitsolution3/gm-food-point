"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IOrder } from "@/types";
import { formatDate } from "@/utils";
import {
  Calendar,
  Clock,
  DollarSign,
  Hash,
  Users,
  CreditCard,
  Coffee,
  Package,
  Receipt,
  User,
  Table,
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface ViewOrderModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  order: IOrder | null;
}

export default function ViewOrderModal({
  isModalOpen,
  setIsModalOpen,
  order,
}: ViewOrderModalProps) {
  if (!order) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: any;
        label: string;
      }
    > = {
      awaiting_payment: {
        variant: "secondary",
        icon: Clock,
        label: "Awaiting Payment",
      },
      queued: {
        variant: "outline",
        icon: AlertCircle,
        label: "Queued",
      },
      cooking: {
        variant: "default",
        icon: Coffee,
        label: "Cooking",
      },
      ready: {
        variant: "default",
        icon: CheckCircle,
        label: "Ready",
      },
      completed: {
        variant: "default",
        icon: CheckCircle,
        label: "Completed",
      },
      cancelled: {
        variant: "destructive",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const statusInfo = statusMap[status.toLowerCase()] || statusMap.queued;
    const Icon = statusInfo.icon;

    return (
      <Badge variant={statusInfo.variant} className="gap-1 capitalize">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Order Details
            <span className="text-sm font-normal text-muted-foreground">
              {order.orderNumber}
            </span>
            {getStatusBadge(order.status)}
          </DialogTitle>
          <DialogDescription>
            View complete order information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Order Number</div>
              <div className="font-mono font-medium">{order.orderNumber}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Business Date</div>
              <div className="font-medium">{order.businessDate}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Table Number</div>
              <div className="font-medium flex items-center gap-1">
                <Table className="h-4 w-4 text-muted-foreground" />
                {order.tableNumber || "N/A"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Created By</div>
              <div className="font-medium capitalize flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                {order.createdBy || "N/A"}
              </div>
            </div>
          </div>

          {/* Order Type & Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Order Type</div>
              <div className="font-medium capitalize flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                {order.orderType || "N/A"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Payment Method</div>
              <div className="font-medium capitalize flex items-center gap-1">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                {order.paymentMethod || "N/A"}
              </div>
            </div>
          </div>

          {/* Items */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items ({order.items.length})
            </h4>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-5">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              {/* Items */}
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 text-sm py-2 border-b last:border-0"
                >
                  <div className="col-span-5">
                    <div className="font-medium">{item.menuName}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.categoryName}
                    </div>
                  </div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-center">
                    ${item.effectiveUnitPrice.toFixed(2)}
                    {item.originalUnitPrice !== item.effectiveUnitPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        ${item.originalUnitPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 text-right font-medium">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Financial Summary */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.taxPercentage > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tax ({order.taxPercentage}%)
                  </span>
                  <span>${order.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {order.serviceChargePercentage > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Service Charge ({order.serviceChargePercentage}%)
                  </span>
                  <span>${order.serviceChargeAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                <span>Grand Total</span>
                <span>${order.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Notes
              </h4>
              <p className="text-sm">{order.notes}</p>
            </Card>
          )}

          {/* Metadata */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created: {formatDate(order.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated: {formatDate(order.updatedAt)}
              </div>
              {order.estimatedCompletionAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Est. Completion: {formatDate(order.estimatedCompletionAt)}
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              ID: {order._id}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}