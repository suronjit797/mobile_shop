import { ICategory } from "@/interfaces/category.interface";
import { globalEndpoints } from "../globalEndpoints";
import { mainApi } from "../mainApi";

const path = "category";
const name = "Category";

export const categoryApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    ...globalEndpoints<ICategory, typeof name>(builder, path, name, []),
  }),
});

export const { useGetAllCategoryQuery, useUpdateCategoryMutation, useDeleteCategoryMutation, useGetByIdCategoryQuery, useCreateCategoryMutation } =
  categoryApi;
