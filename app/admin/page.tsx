'use client';

import { useGetSlackUsersQuery } from "@/lib/slack/api";

export default function AdminPage() {
    const { data: users, isLoading } = useGetSlackUsersQuery();
    
    return <div className="flex items-center h-full flex-col gap-y-4 w-full">
        This is the admin page.
    </div>;
}