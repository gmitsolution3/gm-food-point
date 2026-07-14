export interface ITable {
  _id: string;
  tableNumber: number;
  status: "available" | "occupied";
  occupiedAt: string | null;
}