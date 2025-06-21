import { CalendarEvent } from "@/app/calendar/models";
import { baseApi } from "./baseApi";
import { EventFormData } from "@/app/admin/events/components/EventModal";

type EventsResponse = CalendarEvent[]

interface EventsParameters {
    today?: boolean;
}
export const eventsApi = baseApi
.enhanceEndpoints({ addTagTypes: ['Events'] })
.injectEndpoints({
    endpoints: (builder) => ({
        getEvents: builder.query<EventsResponse, EventsParameters | void>({
            query: (params) => ({
                url: "/events",
                params
            }),
            providesTags: ['Events']
        }),
        getEventAsAdmin: builder.query<CalendarEvent, string>({
            query: (eventId) => ({
                url: `/admin/event/${eventId}`
            })
        }),
        getEventsAsAdmin: builder.query<EventsResponse, EventsParameters | void>({
            query: (params) => ({
                url: "/admin/events",
                params
            }),
            providesTags: ['Events']
        }),
        createEvent: builder.mutation<void, EventFormData>({
            query: (data) => ({
                url: '/event',
                data,
                method: 'POST'
            }),
            invalidatesTags: ['Events']
        }),
        updateEvent: builder.mutation<void, EventFormData & { id: string }>({
            query: (data) => ({
                url: `/event/${data.id}`,
                data,
                method: 'PUT'
            }),
            invalidatesTags: ['Events']
        }),
        deleteEvent: builder.mutation<void, string>({
            query: (eventId) => ({
                url: `/delete-event/${eventId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Events']
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetEventsQuery,
    useGetEventsAsAdminQuery,
    useDeleteEventMutation,
    useCreateEventMutation,
    useUpdateEventMutation,
    useGetEventAsAdminQuery
} = eventsApi;