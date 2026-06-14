import envConfig from "@/config/envConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export const mainApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.BASED_API_URL + "/api/v1/",
    // prepareHeaders: async (headers, { getState }) => {
    //   const token = await (getState() as RootState).auth.token;
    //   const language = localStorage.getItem("i18nextLng") || "en";

    //   if (token) headers.set("Authorization", token);
    //   headers.set("Accept-Language", language);

    //   return headers;
    // },
    credentials: "include",
  }),

  tagTypes: ["User", "Profile"],
  endpoints: (builder) => ({}),
});
