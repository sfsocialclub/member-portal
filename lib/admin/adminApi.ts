import { baseApi } from "../baseApi";

export const adminApi = baseApi
.injectEndpoints({
    endpoints: (builder) => ({
        deleteScan: builder.mutation<void, { scanId: string, eventId: string }>({
            query: ({ scanId }) => ({
                url: `/admin/delete-scan/${scanId}`,
                method: "delete"
            }),
            invalidatesTags: (result, error, { eventId }) => [{ type: 'Event', id: eventId }, 'Events'],
        }),
        deleteManualCheckin: builder.mutation<void, { document_id: string, eventId: string }>({
            query: ({ document_id }) => ({
                url: `/admin/delete-manual-checkin/${document_id}`,
                method: "delete"
            }),
            invalidatesTags: (result, error, { eventId }) => [{ type: 'Event', id: eventId }, 'Events'],
        }),
        manualCheckIn: builder.mutation<{message:string;}, { slackUserIds: string[], eventId: string }>({
            query: ({ slackUserIds, eventId }) => ({
                url: `/event/${eventId}/checkIn`,
                data: { slackUserIds },
                method: "post"
            }),
            invalidatesTags: (result, error, { eventId }) => [{ type: 'Event', id: eventId }, 'Events'],
        }),
        getUsers: builder.query<{
            id: string,
            slackId: string,
            name: string,
            email: string,
            image: string,
            emailVerified: boolean,
            isAdmin: boolean
        }[], void>({
            query: () => ({
                url: `/admin/users`,
            }),
        }),
    }),
    overrideExisting: false,
})

export const { 
    useDeleteScanMutation,
    useDeleteManualCheckinMutation,
    useManualCheckInMutation,
    useGetUsersQuery
 } = adminApi;