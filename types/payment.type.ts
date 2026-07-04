export interface IPayment {
  orderId: string;
  orderNumber: string;
  businessDate: string;
  paymentMethod: string;
  status: string;
  amount: number;
  amountReceived: number | null;
  changeAmount: number | null;
  gatewayTransactionId: string | null;
  gatewayPayload: string | null;
  confirmedAt: string | null;
  expiresAt: string;
  remarks: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
