'use client';
import { UserCalendarEvent } from "@/app/calendar/models";
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
    events: UserCalendarEvent[];
    dateJoined: string;
}

// Deprecated, unused
export const userApi = baseApi
    .injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<GetUserResponse, string>({
            query: (id) => ({
                url: `/user/${id}`,
            }),
        })
    }),
    overrideExisting: false
})

