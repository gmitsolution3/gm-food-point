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
import { IPayment } from "@/types";
import { formatDate } from "@/utils";
import {
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Receipt,
  Wallet,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hash,
  Users,
} from "lucide-react";

interface ViewPaymentModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  payment: IPayment | null;
}

export default function ViewPaymentModal({
  isModalOpen,
  setIsModalOpen,
  payment,
}: ViewPaymentModalProps) {
  if (!payment) return null;

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
      pending: {
        variant: "secondary",
        icon: Clock,
        label: "Pending",
      },
      paid: {
        variant: "default",
        icon: CheckCircle,
        label: "Paid",
      },
      failed: {
        variant: "destructive",
        icon: XCircle,
        label: "Failed",
      },
      refunded: {
        variant: "outline",
        icon: AlertCircle,
        label: "Refunded",
      },
    };

    const statusInfo = statusMap[status.toLowerCase()] || statusMap.pending;
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
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Payment Details
            <span className="text-sm font-normal text-muted-foreground">
              {payment.orderNumber}
            </span>
            {getStatusBadge(payment.status)}
          </DialogTitle>
          <DialogDescription>
            View complete payment information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Order Number</div>
              <div className="font-mono font-medium">{payment.orderNumber}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Business Date</div>
              <div className="font-medium">{payment.businessDate}</div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Amount</div>
              <div className="font-medium text-lg flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                {payment.amount.toFixed(2)}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Payment Method</div>
              <div className="font-medium capitalize flex items-center gap-1">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                {payment.paymentMethod || "N/A"}
              </div>
            </div>
          </div>

          {/* Cash Payment Details (if cash) */}
          {payment.paymentMethod === "cash" && (
            <Card className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Cash Payment Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Received</span>
                  <span className="font-medium">${payment.amountReceived?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Change Amount</span>
                  <span className="font-medium">${payment.changeAmount?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Online Payment Details (if online) */}
          {payment.paymentMethod === "online" && (
            <Card className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Online Payment Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gateway Transaction ID</span>
                  <span className="font-mono text-sm">
                    {payment.gatewayTransactionId || "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Remarks */}
          {payment.remarks && (
            <Card className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Remarks</h4>
              <p className="text-sm">{payment.remarks}</p>
            </Card>
          )}

          {/* Metadata */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created: {formatDate(payment.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated: {formatDate(payment.updatedAt)}
              </div>
              {payment.confirmedAt && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Confirmed: {formatDate(payment.confirmedAt)}
                </div>
              )}
              {payment.expiresAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Expires: {formatDate(payment.expiresAt)}
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              ID: {payment._id}
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