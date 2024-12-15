"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";
import { useAuthenticated } from "../hooks/useAuthenticated";
import { useAppSelector } from "@/lib/hooks";

export const NavLinks = () => {
    const pathname = usePathname();
    const isAuthenticated = useAuthenticated();
    const role = useAppSelector(state => state.auth.role)
    const isAdmin = role === 'admin';

    if(!isAuthenticated) { return null }

    return (
        <nav className="flex gap-2 items-center">
            <Link className={`link ${pathname === '/member' ? 'font-bold' : ''}`} href="/member">
                Home
            </Link>

            {
                isAdmin && (
                    <Link
                        className={`link ${pathname === '/admin' ? 'font-bold' : ''}`}
                        href="/admin"
                    >
                        Admin
                    </Link>
                )
            }
            <LogoutButton/>

        </nav>
    )
}