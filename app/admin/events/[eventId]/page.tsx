'use client'
import { useGetEventAsAdminQuery } from "@/lib/eventsApi";
import { useGetSlackUsersQuery } from "@/lib/slack/api";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckInModal } from "../components/CheckInModal";
import { DeleteDialog } from "./components/DeleteDialog";
import { isManualCheckInRow, ManualCheckInRow, ScanRow } from "./util";
import { formatDateTimeForTable } from "@/lib/util/dateFormatters";

const AdminEventPage = () => {
    const eventId = useParams().eventId as string;
    const { data: event, isFetching: isFetchingEvent } = useGetEventAsAdminQuery(eventId);
    const [checkInModalOpen, setCheckInModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<ScanRow | ManualCheckInRow | undefined>(undefined);
    const { data: slackUsers, isFetching: isFetchingSlackUsers } = useGetSlackUsersQuery();

    const columnDefs: GridColDef<ScanRow | ManualCheckInRow>[] = [
        {
            field: 'userName',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'scan_time',
            headerName: 'Checked In At',
            width: 200,
            valueGetter: (value, row) => {
                if (isManualCheckInRow(row)) {
                    return formatDateTimeForTable(row.created_at);
                } else {
                    return formatDateTimeForTable(value);
                }
            },
            valueFormatter: (value) => formatDateTimeForTable(value),
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 200,
            valueFormatter: (value) => value === 'manualCheckIn' ? 'Manual' : 'Scan',
        },
        {
            field: 'checkedInBy',
            headerName: 'Checked In By',
            width: 200,
            valueGetter: (_value, row) => {
                if (isManualCheckInRow(row)) {
                    return row.createdByName;
                } else {
                    return row.scannedByName;
                }
            }
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: any) => [
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => openConfirmDelete(params.row)} />,
            ],
        },

    ]

    const openConfirmDelete = (entity: ScanRow | ManualCheckInRow) => {
        setEntityToDelete(entity);
        setDeleteDialogOpen(true);
    }

    const rows = useMemo(() => {
        if (!event) return [];

        const scansRows = event.scans.map(s => ({ ...s, type: 'scan' }));
        const manualCheckInsRows = event.manualCheckIns.map(m => ({ ...m, type: 'manualCheckIn' }));

        return [...scansRows, ...manualCheckInsRows];
    }, [event]);

    return <div className="h-full flex w-full">
        <div className="flex flex-col max-h-[calc(100%)] max-w-full w-full">
            <h1 className="pt-8 pb-4 text-lg">Check-ins</h1>
            <button
                className="btn btn-primary mb-4 w-fit"
                onClick={() => {
                    setCheckInModalOpen(true);
                }}
            >
                Add Check-in
            </button>
            <DataGrid rows={rows} columns={columnDefs} showToolbar loading={isFetchingEvent || isFetchingSlackUsers} />
            {
                checkInModalOpen && <CheckInModal isOpen={checkInModalOpen} onClose={() => {
                    setCheckInModalOpen(false);
                }} />
            }
            <DeleteDialog isOpen={deleteDialogOpen} onClose={() => {
                setDeleteDialogOpen(false);
            }} entity={entityToDelete} />
        </div>
    </div>;
};

export default AdminEventPage;