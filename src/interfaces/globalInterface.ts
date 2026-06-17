import { ICategory } from "./category.interface";
import { IProduct } from "./product.interface";

export interface mongooseDocument {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormDrawerState<T> {
  open: boolean;
  mode?: "create" | "update";
  data?: Partial<T>;
}

export interface WishlistItem {
  product: IProduct;
  addedAt: string;
}

export interface CartItem {
  product: IProduct;
  quantity: number;
}