'use client'
import { CalendarEvent, Scan } from "@/app/calendar/models";
import { useGetEventAsAdminQuery } from "@/lib/eventsApi";
import { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "next/navigation";

const AdminEventPage = () => {
    const eventId = useParams().eventId as string;
    const { data: event } = useGetEventAsAdminQuery(eventId)

    const columnDefs: GridColDef<Scan>[] = [
        {
            field: 'userName',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'scan_time',
            headerName: 'Scanned',
            width: 200,
            valueFormatter: (value) => new Date(value).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }),
        },
    ]

    return <div className="h-full flex w-full">
        <div className="flex flex-col max-h-[calc(100%)] max-w-full w-full">
            <h1 className="pt-8 pb-4 text-lg">User scans</h1>
            <DataGrid rows={event?.scans || []} columns={columnDefs} showToolbar />
        </div>
    </div>;
};

export default AdminEventPage;