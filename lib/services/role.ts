"use client";

import { baseAPI } from ".";

export interface GetRoleResponse {
  role: "admin" | "user";
}

export const roleAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getRole: builder.query<GetRoleResponse, string | undefined>({
      query: (accessToken) => ({
        url: "role",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
});

export const { useLazyGetRoleQuery } = roleAPI;
