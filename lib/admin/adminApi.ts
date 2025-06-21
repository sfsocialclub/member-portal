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
        })
    }),
    overrideExisting: false,
})

export const { useDeleteScanMutation } = adminApi;