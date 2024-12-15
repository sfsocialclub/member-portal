"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

// Define a service using a base URL and expected endpoints
export const baseAPI = createApi({
  reducerPath: "baseApi",
  baseQuery: async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await axios({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as any;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  },
  endpoints: () => ({}),
});
