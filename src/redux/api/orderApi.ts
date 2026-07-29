import { IOrder } from "@/interfaces/order.interface";
import { globalEndpoints } from "../globalEndpoints";
import { mainApi } from "../mainApi";

const path = "order";
const name = "Order";

export const orderApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    ...globalEndpoints<IOrder, typeof name>(builder, path, name, ["Product"]),
  }),
});

export const {
  useLazyGetAllOrderQuery,
  useLazyGetByIdOrderQuery,

  useGetAllOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetByIdOrderQuery,
  useCreateOrderMutation,
} = orderApi;
