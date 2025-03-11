import { baseApi } from "../baseApi";

interface ScanResponse {
    message: string;
}

interface ScanParameters {
    userId: string;
    eventId: string;
}

export const scannerApi = baseApi
.injectEndpoints({
    endpoints: (builder) => ({
        scan: builder.mutation<ScanResponse, ScanParameters>({
            query: (data) => ({
                url: "/scan",
                data,
                method: "post"
            }),
            invalidatesTags: ['AttendedEvents']
        })
    }),
    overrideExisting: false,
})

export const { useScanMutation } = scannerApi;