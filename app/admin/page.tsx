'use client';

import { useRouter } from "next/navigation";

interface CardProps {
    title?: string;
    description?: string;
    onClick?: () => void;
}

const Card = ({ title, description, onClick }: CardProps) => {
    return (
        <div className="card max-w-96 w-full bg-base-100 card-md shadow-sm hover:bg-gray-100 cursor-pointer transition-all" onClick={onClick}>
            <div className="card-body">
                {title && <h2 className="card-title">{title}</h2>}
                {description && <p>{description}</p>}
            </div>
        </div>
    )
}

export default function AdminPage() {
    const router = useRouter();

    return <div className="flex flex-col items-center h-full w-full max-w-sm md:max-w-[2560px]">
        <div className="flex flex-col mb-20 w-full">
            <h1 className="text-xl font-semibold">Admin</h1>
            <p>This is best viewed from a non-mobile device</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
            <Card title="Users" description={`Manage users`} onClick={() => router.push('/admin/users')} />
            <Card title="Events" description={`Manage event details, hosts, and view scans`} onClick={() => router.push('/admin/events')} />
        </div>
    </div>;
}