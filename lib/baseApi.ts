'use client';
import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getSession } from 'next-auth/react';
import { SFSCSession } from './auth/authOptions';

const BASE_URL = '/flaskApi';

const axiosBaseQuery =
    (
        { baseUrl }: { baseUrl: string } = { baseUrl: '' }
    ): BaseQueryFn<
        {
            url: string
            method?: AxiosRequestConfig['method']
            data?: AxiosRequestConfig['data']
            params?: AxiosRequestConfig['params']
            headers?: AxiosRequestConfig['headers']
        },
        unknown,
        unknown
    > =>
        async ({ url, method, data, params, headers }) => {
            try {
                const session = await getSession() as SFSCSession; // dynamically fetch session
                const token = session?.apiToken;

                const result = await axios({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers: {
                        ...headers,
                        'Authorization': token ? `Bearer ${token}` : '',
                        'X-CSRF-TOKEN': Cookies.get('csrf_access_token')
                    },
                })
                return { data: result.data }
            } catch (axiosError) {
                const err = axiosError as AxiosError
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                }
            }
        }

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: axiosBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: () => ({}),
})
.enhanceEndpoints({ addTagTypes: ['Events', 'Event'] })