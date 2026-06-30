import { IMenuItem } from "./menu-item.type";

export interface ICartItem {
  lineId: string;
  item: IMenuItem;
  quantity: number;
}

export interface ICartContextValue {
  items: ICartItem[];
  orderType: "dine-in" | "take-out" | null;
  setOrderType: (type: "dine-in" | "take-out" | null) => void;
  addItem: (item: IMenuItem, quantity: number) => void;
  updateQuantity: (lineId: string, qty: number) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
  subtotal: number;
  discount: number;
  tax: number;
  taxPercentage: number; // Add this
  serviceCharge: number;
  serviceChargePercentage: number; // Add this
  total: number;
  totalItems: number;
}
