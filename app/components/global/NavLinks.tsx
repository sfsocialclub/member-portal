"use client"
import Link from "next/link";
import { usePathname } from "next/navigation"
import { useAuthenticated } from "./useAuthenticated";
import { LogoutButton } from "../auth/LogoutButton";
import Cookies from "js-cookie";

export const NavLinks = () => {
    const pathname = usePathname();
    const isAuthenticated = useAuthenticated();
    const isAdmin = Cookies.get('role') === 'admin';

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