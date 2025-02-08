'use client';
import { baseApi } from "@/lib/baseApi";

export enum UserRole {
    member='member',
    admin='admin'
}

export type GetUserResponse = {
    role: UserRole
    name: string;
    email: string;
    points: number;
    photo: string;
    // TODO: Replace any with event type
    events_attended: any[];
    dateJoined: string;
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

