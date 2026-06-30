export type TCategory = "Pizza" | "Burger" | "Rice" | "Chicken" | "Drinks" | "Dessert";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}