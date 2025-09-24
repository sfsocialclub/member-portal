'use client';
import { SlackUser, useGetSlackUsersQuery } from "@/lib/slack/api";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const cols: GridColDef<SlackUser>[] = [
    {
        field: 'profile',
        headerName: 'Name',
        width: 200,
        valueGetter: (profile: SlackUser['profile']) => {
            return profile?.real_name
        },
    },
    {
        field: 'is_admin',
        headerName: 'Admin',
        width: 100,
        valueGetter: (is_admin: SlackUser['is_admin']) => {
            return is_admin ? 'Yes' : 'No'
        },
    }
]

const AdminUsersPage = () => {
    const { data: users, isFetching } = useGetSlackUsersQuery(undefined, {
        refetchOnMountOrArgChange: process.env.NODE_ENV !== 'development',
    });
    
    return <div className="flex-grow flex w-full">
        <div className="flex flex-col flex-grow max-h-[calc(100vh_-_64px-48px-100px)] max-w-full w-full">
            <DataGrid
            className="max-h-[calc(100%)]"
            rows={users} columns={cols} showToolbar loading={isFetching}/>
        </div>
    </div>;
}
export default AdminUsersPage;