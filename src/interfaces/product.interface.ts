import { ICategory } from "./category.interface";
import { mongooseDocument } from "./globalInterface";
import { IUser } from "./userInterface";

export interface IProduct extends mongooseDocument {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string | ICategory;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  seller: string | IUser;
}
