import { mongooseDocument } from "./globalInterface";
import { IProduct } from "./product.interface";
import { IUser } from "./userInterface";

export interface ICustomerOrderInfo {
  city: string;
  country: string;
  name: string;
  phone: string;
  state: string;
  street: string;
  zipCode: string;
  paymentMethod: string;
}

export interface IOrder extends mongooseDocument {
  orderId: number;
  items: {
    product: string | IProduct;
    quantity: number;
  };
  customer: string | IUser;
  customerOrderInfo: ICustomerOrderInfo;
  status: "delivered" | "processing" | "shipped" | "pending" | "cancelled";
}
