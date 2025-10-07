'use client'
import { useGetEventAsAdminQuery } from "@/lib/eventsApi";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DeleteDialog } from "./components/DeleteDialog";
import { CheckInModal } from "../components/CheckInModal";
import { useGetUsersQuery } from "@/lib/admin/adminApi";
import { useGetSlackUsersQuery } from "@/lib/slack/api";
import { isManualCheckInRow, ManualCheckInRow, ScanRow } from "./util";

const AdminEventPage = () => {
    const eventId = useParams().eventId as string;
    const { data: event, isFetching: isFetchingEvent } = useGetEventAsAdminQuery(eventId);
    const [checkInModalOpen, setCheckInModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<ScanRow | ManualCheckInRow | undefined>(undefined);
    const { data: users, isFetching: isFetchingUsers } = useGetUsersQuery();
    const { data: slackUsers, isFetching: isFetchingSlackUsers } = useGetSlackUsersQuery();

    const columnDefs: GridColDef<ScanRow | ManualCheckInRow>[] = [
        {
            field: 'userName',
            headerName: 'Name',
            width: 200,
            valueGetter: (value, row) => {
                if(isManualCheckInRow(row)) {
                    return slackUsers?.find((slackUser) => slackUser.id === row.slack_user_id)?.profile?.real_name;
                } else {
                    return value;
                }
            }
        },
        {
            field: 'scan_time',
            headerName: 'Checked In At',
            width: 200,
            valueGetter: (value, row) => {
                if (isManualCheckInRow(row)) {
                    return new Date(row.created_at).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' });
                } else {
                    return new Date(value).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' });
                }
            },
            valueFormatter: (value) => new Date(value).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }),
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
                    return users?.find((user) => user.id === row.created_by)?.name;
                } else {
                    return users?.find((user) => user.id === row.scanned_by)?.name;
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
            <DataGrid rows={rows} columns={columnDefs} showToolbar loading={isFetchingEvent || isFetchingSlackUsers || isFetchingUsers} />
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