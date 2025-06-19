'use client';
import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import Cookies from 'js-cookie';

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
                const tokenRes = await fetch("/authToken")
                const tokenJson = await tokenRes.json()
                const token = tokenJson.token

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
.enhanceEndpoints({ addTagTypes: ['AttendedEvents'] })