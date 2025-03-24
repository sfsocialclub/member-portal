import { CalendarEvent } from "@/app/calendar/models";
import { baseApi } from "./baseApi";

type EventsResponse = CalendarEvent[]

interface EventsParameters {
    today?: boolean;
}

export const eventsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getEvents: builder.query<EventsResponse, EventsParameters | void>({
            query: (params) => ({
                url: "/events",
                // method: params ? "POST" : "GET",
                params
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetEventsQuery,
} = eventsApi;