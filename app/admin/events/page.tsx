'use client'
import { useCreateEventMutation, useGetEventsAsAdminQuery, useGetEventsQuery, useUpdateEventMutation } from "@/lib/eventsApi";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { EventFormData, EventModal } from "./components/EventModal";
import { useGetSlackUsersQuery } from "@/lib/slack/api";
import { DeleteDialog } from "./components/DeleteDialog";
import { CalendarEvent } from "@/app/calendar/models";
import Link from "next/link";


const AdminEventsPage = () => {
    const { data: events } = useGetEventsAsAdminQuery();
    const { data: users } = useGetSlackUsersQuery();

    const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<CalendarEvent | undefined>();
    const [isEditing, setEditing] = useState(false);
    const [editEventData, setEditEventData] = useState<CalendarEvent | undefined>(undefined);

    const [createEvent] = useCreateEventMutation();
    const [updateEvent] = useUpdateEventMutation();

    const cols: GridColDef<CalendarEvent>[] = useMemo(() => ([
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'startDateTime', headerName: 'Start', width: 200,
            valueFormatter: (value) => new Date(value).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }),
         },
        { field: 'endDateTime', headerName: 'End', width: 200,
            valueFormatter: (value) => value ? new Date(value).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }) : null,
        },
        { field: 'location', headerName: 'Location', width: 200, valueGetter: (value, row) => row.location?.name },
        { field: 'location.address', headerName: 'Address', width: 200, valueGetter: (value, row) => row.location?.address },
        {
            field: 'hosts',
            headerName: 'Hosts',
            valueGetter: (value, row) => {
                const hostNames = row.hostUserIds?.map(id => users?.find(u => u.id === id)?.profile?.display_name)
                return hostNames && `(${hostNames?.length}) ${hostNames?.join(", ")}` 
            },
            width: 200,
        },
        {
            field: 'scanCount',
            headerName: '# Scans',
            renderCell: (params) => <Link className="link text-primary" href={`/admin/events/${params.row.id}`}>{params.value}</Link>,
            width: 100
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: any) => [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => openEditDialog(params.row)} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => openConfirmDelete(params.row)} />,
            ],
        },
        
    ]), [users]);

    const openEditDialog = (event: any) => {
        setEditing(true);
        setEditEventData(event);
        setCreateEditModalOpen(true);
    };

    const openConfirmDelete = (event: any) => {
        setEventToDelete(event);
        setDeleteDialogOpen(true);
    }

    const handleSubmitCreateEditEventModal = (data: EventFormData) => {
        if (isEditing && editEventData) {
            updateEvent({ ...data, id: editEventData?.id });
        } else {
            createEvent(data)
        }
    };

    const sortedUsers = useMemo(() => {
        return (users ?? [])
            .filter(u => u.profile?.real_name)
            .sort((a, b) => {
                const nameA = a.profile?.real_name?.toLowerCase() ?? '';
                const nameB = b.profile?.real_name?.toLowerCase() ?? '';
                return nameA.localeCompare(nameB);
            })
            .map(u => ({
                id: u.id,
                name: u.profile?.real_name,
                email: u.profile?.email,
            }));
    }, [users]);



    return <div className="h-full flex w-full">
        <div className="flex flex-col max-h-[calc(100%_-_112px)] max-w-full w-full">
            <button
                className="btn btn-primary mb-4 w-fit"
                onClick={() => {
                    setEditing(false);
                    setEditEventData(undefined);
                    setCreateEditModalOpen(true);
                }}
            >
                Create Event
            </button>

            <DataGrid rows={events} columns={cols} showToolbar />
            {createEditModalOpen && <EventModal
                isOpen={createEditModalOpen}
                onClose={() => {
                    setCreateEditModalOpen(false);
                    setEditEventData(undefined);
                }}
                onSubmit={handleSubmitCreateEditEventModal}
                isEditing={isEditing}
                initialData={editEventData}
                users={sortedUsers}
            />}
            <DeleteDialog isOpen={deleteDialogOpen} onClose={() => {
                setDeleteDialogOpen(false);
            }} event={eventToDelete} />
        </div>
    </div>;
}

export default AdminEventsPage;