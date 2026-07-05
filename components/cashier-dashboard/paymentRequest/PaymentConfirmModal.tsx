import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IPendingPayment } from "@/types/payment.type";
import { DollarSign } from "lucide-react";

interface PaymentConfirmModalProps {
  selectedPayment: IPendingPayment | null;
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: (open: boolean) => void;
  setPaymentAmount: (value: string) => void;
  paymentAmount: string;
  setSelectedPayment: (p: IPendingPayment | null) => void;
  handleConfirm: () => void;
}

export default function PaymentConfirmModal({
  selectedPayment,
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  setPaymentAmount,
  paymentAmount,
  setSelectedPayment,
  handleConfirm,
}: PaymentConfirmModalProps) {
  return (
    <Dialog
      open={isConfirmModalOpen}
      onOpenChange={setIsConfirmModalOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Please verify the payment amount for{" "}
            {selectedPayment?.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3 relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          {selectedPayment && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Order</Label>
              <div className="col-span-3 text-sm font-medium">
                {selectedPayment.orderNumber}
              </div>
            </div>
          )}

          {selectedPayment && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Table</Label>
              <div className="col-span-3 text-sm">
                Table {selectedPayment.tableNumber}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsConfirmModalOpen(false);
              setSelectedPayment(null);
              setPaymentAmount("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !paymentAmount || parseFloat(paymentAmount) <= 0
            }
            className="bg-green-500 hover:bg-green-600"
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
