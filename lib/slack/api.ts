import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WebClient } from '@slack/web-api';
import { getSession } from 'next-auth/react';

export const slackApi = createApi({
  reducerPath: 'slackApi',
 baseQuery: fetchBaseQuery({ baseUrl: '/slackApi/' }),
  endpoints: (builder) => ({
    getSlackUsers: builder.query<any, void>({
      query: () => 'users',
    }),
    getSlackUserInfo: builder.query<any, void>({
      query: () => `user-info`,
    })
  }),
});

export const { useGetSlackUsersQuery, useGetSlackUserInfoQuery } = slackApi;