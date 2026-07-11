// utils/tableNumber.ts
export const getTableNumber = (): string => {
  if (typeof window === "undefined") return "1";
  return localStorage.getItem("tableNumber") || "1";
};

export const setTableNumber = (number: string): void => {
  localStorage.setItem("tableNumber", number);
};