import { mongooseDocument } from "./globalInterface";

export interface IUser extends mongooseDocument {
  name: string;
  email: string;
  role: "superAdmin" | "admin" | "user";
}
