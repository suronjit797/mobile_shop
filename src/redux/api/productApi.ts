import { IProduct } from "@/interfaces/product.interface";
import { globalEndpoints } from "../globalEndpoints";
import { mainApi } from "../mainApi";

const path = "product";
const name = "Product";

export const productApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    ...globalEndpoints<IProduct, typeof name>(builder, path, name, []),
  }),
});

export const {
  useLazyGetAllProductQuery,
  useLazyGetByIdProductQuery,

  useGetAllProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetByIdProductQuery,
  useCreateProductMutation,
} = productApi;
