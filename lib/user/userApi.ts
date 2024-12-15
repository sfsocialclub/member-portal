'use client';
import { baseApi } from "@/lib/baseApi";

export enum UserRole {
    member='member',
    admin='admin'
}

type GetUserResponse = {
    role: UserRole
    name: string
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<GetUserResponse, string>({
            query: (id) => ({
                url: `/user/${id}`,
            })
        })
    }),
    overrideExisting: false
})

