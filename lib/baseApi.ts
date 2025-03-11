'use client';
import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import Cookies from 'js-cookie';

const BASE_URL = '/api';

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
            const token = Cookies.get('access_token');

            try {
                const result = await axios({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers: {
                        ...headers,
                        ...token && { authorization: `Bearer ${token}` }
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
.enhanceEndpoints({ addTagTypes: ['AttendedEvents'] })