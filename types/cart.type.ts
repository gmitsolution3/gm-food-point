import { IMenuItem } from "./menu-item.type";

export interface ICartItem {
  lineId: string;
  item: IMenuItem;
  quantity: number;
}

export interface ICartContextValue {
  items: ICartItem[];
  orderType: "dine-in" | "take-out" | null;
  setOrderType: (t: "dine-in" | "take-out") => void;
  addItem: (
    item: IMenuItem,
    quantity: number,
  ) => void;
  updateQuantity: (lineId: string, qty: number) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  totalItems: number;
}
