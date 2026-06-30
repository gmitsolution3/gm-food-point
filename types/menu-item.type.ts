import { ICategory } from "./category.type";


export interface IMenuItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: ICategory;
  image: string;
  price: number;
  discountPrice: number | null;
  preparationTime: number;
  suggestedItems: string[];
  displayOrder: number;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}