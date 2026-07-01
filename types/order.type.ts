export interface IOrderItem {
  menuId: string;
  menuName: string;
  categoryId: string;
  categoryName: string;
  originalUnitPrice: number;
  effectiveUnitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  businessDate: string;
  tableNumber: number;
  createdBy: string;
  orderType: "dine-in" | "take-out";
  paymentMethod: "cash" | "wechat" | "card" | "mobile";
  status: "awaiting_payment" | "paid" | "preparing" | "ready" | "completed" | "cancelled";
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  taxPercentage: number;
  taxAmount: number;
  serviceChargePercentage: number;
  serviceChargeAmount: number;
  grandTotal: number;
  orderPreparationTime: number;
  estimatedCompletionAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}