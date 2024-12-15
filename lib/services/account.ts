"use client";

import { baseAPI } from ".";
import { GetRoleResponse } from "./role";

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse extends GetRoleResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends GetRoleResponse {
  accessToken: string;
}

export const accountAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: "signup",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = accountAPI;
