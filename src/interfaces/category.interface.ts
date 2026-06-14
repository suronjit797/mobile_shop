import { mongooseDocument } from "./globalInterface";

export interface ICategory extends mongooseDocument {
  name: string;
  slug: string;
  image: string;
}
