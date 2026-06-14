import { IUser } from "@/interfaces/userInterface";
import { IResponse, LoginRequest, LoginResponse } from "../reduxTypes";
import { mainApi } from "../mainApi";
import { globalEndpoints } from "../globalEndpoints";

const path = "user";
const name = "User";

export const userApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    ...globalEndpoints<IUser, typeof name>(builder, path, name, []),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: `${path}/login`, method: "POST", body }),
    }),

    getProfile: builder.query<IUser, void>({
      query: () => ({ url: `${path}/profile`, method: "GET" }),
    }),
  }),
});

export const {
  useLazyGetAllUserQuery,
  useLazyGetByIdUserQuery,

  useGetAllUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetByIdUserQuery,
  useCreateUserMutation,
  useLoginMutation,
  useGetProfileQuery,
} = userApi;
