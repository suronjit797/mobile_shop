import envConfig from "@/config/envConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export const mainApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.BASED_API_URL + "/api/v1/",
    credentials: "include",
  }),

  tagTypes: ["User", "Profile", "Product", "Order", "Category"],
  endpoints: (builder) => ({}),
});

