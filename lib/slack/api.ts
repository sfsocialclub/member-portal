import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UsersListResponse } from '@slack/web-api';

export type SlackUser = NonNullable<UsersListResponse['members']>[number];

export const slackApi = createApi({
  reducerPath: 'slackApi',
 baseQuery: fetchBaseQuery({ baseUrl: '/slackApi/' }),
  endpoints: (builder) => ({
    getSlackUsers: builder.query<SlackUser[], void>({
      query: () => 'users',
      keepUnusedDataFor: process.env.NODE_ENV === 'development' ? 300 : 60, // 5min dev, 1min prod
    }),
    getSlackUserInfo: builder.query<any, void>({
      query: () => `user-info`,
    })
  }),
});

export const { useGetSlackUsersQuery, useGetSlackUserInfoQuery } = slackApi;