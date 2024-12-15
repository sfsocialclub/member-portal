"use client";

import { baseAPI } from ".";
import { GetRoleResponse } from "./role";

export interface GetLoginResponse extends GetRoleResponse {
  accessToken: string;
}

export const loginAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<GetLoginResponse, string>({
      query: (email) => ({
        url: "login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = loginAPI;
