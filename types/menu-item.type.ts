import { StaticImageData } from "next/image";
import { TCategory } from "./category.type";

export interface IAddOn {
  id: string;
  name: string;
  price: number;
}

export interface IMenuItem {
  id: string;
  name: string;
  description: string;
  category: TCategory;
  price: number;
  discountPrice?: number;
  image: string | StaticImageData;
  addons: IAddOn[];
}