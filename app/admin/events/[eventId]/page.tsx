'use client'
import { Scan } from "@/app/calendar/models";
import { useGetEventAsAdminQuery } from "@/lib/eventsApi";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DeleteDialog } from "./components/DeleteDialog";

const AdminEventPage = () => {
    const eventId = useParams().eventId as string;
    const { data: event, isFetching } = useGetEventAsAdminQuery(eventId)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [scanData, setScanData] = useState<Scan | undefined>(undefined);

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
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: any) => [
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => openConfirmDelete(params.row)} />,
            ],
        },

    ]

    const openConfirmDelete = (scanData: Scan) => {
        setScanData(scanData);
        setDeleteDialogOpen(true);
    }

    return <div className="h-full flex w-full">
        <div className="flex flex-col max-h-[calc(100%)] max-w-full w-full">
            <h1 className="pt-8 pb-4 text-lg">User scans</h1>
            <DataGrid rows={event?.scans || []} columns={columnDefs} showToolbar loading={isFetching} />
            <DeleteDialog isOpen={deleteDialogOpen} onClose={() => {
                setDeleteDialogOpen(false);
            }} scan={scanData} />
        </div>
    </div>;
};

export default AdminEventPage;