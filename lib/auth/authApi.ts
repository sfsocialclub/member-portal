import { baseApi } from "@/lib/baseApi";
import { UserRole } from "../user/userApi";

type LoginResponse = {
  access_token: string;
  role: UserRole;
  userId: string;
};

type LoginParameters = {
  email: string;
  password: string;
};

type LoadResponse = {
  role: UserRole;
  userId: string;
};

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface SignupResponse {
  access_token: string;
  role: UserRole;
  userId: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginParameters>({
      query: (data) => ({
        url: "/login",
        headers: {
          "Content-Type": "application/json",
        },
        data,
        method: "post",
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      }),
    }),
    load: builder.query<LoadResponse, void>({
      query: () => ({ url: "/load" }),
    }),
  }),
  overrideExisting: false,
});

export const { useSignupMutation, useLoginMutation } = authApi;
