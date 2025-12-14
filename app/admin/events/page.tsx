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
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .sticky-actions': {
        position: 'sticky',
        left: 0,
        zIndex: 1,
        background: 'white',
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)',
    },
    '& .MuiDataGrid-columnHeaders': {
        position: 'relative',
    },
    '& .MuiDataGrid-columnHeader[data-field="actions"]': {
        position: 'sticky',
        left: 0,
        zIndex: 31,
        background: 'white',
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)',
    },
}))


const AdminEventsPage = () => {
    const { data: events, isFetching } = useGetEventsAsAdminQuery();
    const { data: users } = useGetSlackUsersQuery();

    const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<CalendarEvent | undefined>();
    const [isEditing, setEditing] = useState(false);
    const [editEventData, setEditEventData] = useState<CalendarEvent | undefined>(undefined);

    const [createEvent] = useCreateEventMutation();
    const [updateEvent] = useUpdateEventMutation();

    const cols: GridColDef<CalendarEvent>[] = useMemo(() => ([
        {
            field: 'actions',
            type: 'actions',
            resizeable: false,
            sortable: false,
            filterable: false,
            cellClassName: 'sticky-actions',
            getActions: (params: any) => [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => openEditDialog(params.row)} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => openConfirmDelete(params.row)} />,
            ],
        },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'checkInCount',
            headerName: 'Check-ins',
            renderCell: (params) => <Link className="link text-primary" href={`/admin/events/${params.row.id}`}>{params.value}</Link>,
            width: 100
        },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'isPrivate', headerName: 'Private', width: 100, valueGetter: (value, row) => row.isPrivate ? 'Yes' : 'No' },
        {
            field: 'startDateTime', headerName: 'Start', width: 200,
            valueFormatter: (value) => new Date(value).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }),
        },
        {
            field: 'endDateTime', headerName: 'End', width: 200,
            valueFormatter: (value) => value ? new Date(value).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }) : null,
        },
        { field: 'location', headerName: 'Location', width: 200, valueGetter: (value, row) => row.location?.name },
        { field: 'location.address', headerName: 'Address', width: 200, valueGetter: (value, row) => row.location?.address },
        {
            field: 'hosts',
            headerName: 'Hosts',
            valueGetter: (value, row) => {
                const hostNames = row.hostUserIds?.map(id => users?.find(u => u.id === id)?.profile?.real_name_normalized)
                return hostNames && `(${hostNames?.length}) ${hostNames?.join(", ")}`
            },
            renderCell: (params) => {
                const value = params.value || ''; // fallback for null/undefined
                const tooltipText = value.split(',').join('\n');

                return (
                    <Tooltip
                        title={<pre style={{ margin: 0 }}>{tooltipText}</pre>}
                        arrow
                        placement="top"
                        slotProps={{
                            popper: {
                                modifiers: [
                                    {
                                        name: 'preventOverflow',
                                        options: {
                                            boundary: 'viewport',
                                        },
                                    },
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, 8],
                                        },
                                    },
                                ],
                            },
                            tooltip: {
                                sx: {
                                    maxWidth: 300,
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'monospace',
                                    textAlign: 'left',
                                },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {value}
                        </Box>
                    </Tooltip>
                );
            },
            width: 200,
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



    return <div className="flex-1 h-full flex w-full">
        <div className="flex flex-col max-w-full w-full max-h-[calc(100vh_-_64px-48px-100px)]">
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

            <StyledDataGrid
                className="max-h-[calc(100%)]"
                rows={events}
                //@ts-expect-error - shutup ts
                columns={cols}
                showToolbar
                sortModel={[
                    {
                        field: 'startDateTime',
                        sort: 'desc',
                    },
                ]}
                loading={isFetching}
                disableVirtualization
                sx={{ flexGrow: 1, minHeight: 'calc(100vh - 64px - 48px - 100px - 40px - 16px)'}}
            />
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