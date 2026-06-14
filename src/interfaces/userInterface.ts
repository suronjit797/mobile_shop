import { mongooseDocument } from "./globalInterface";

export enum UserRole {
  SUPER_ADMIN = "superAdmin",
  ADMIN = "admin",
  SELLER = "seller",
  USER = "user",
}

export enum UserRoleFormat {
  "superAdmin" = "Super Admin",
  "admin" = "Admin",
  "seller" = "Seller",
  "user" = "User",
}

export interface IUser extends mongooseDocument {
  name: string;
  email: string;
  role: UserRole;
}
