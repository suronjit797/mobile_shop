import { ICategory } from "./category.interface";

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
