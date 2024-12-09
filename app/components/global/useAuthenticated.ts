"use client";

import Cookies from "js-cookie";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuthenticated = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsAuthenticated(Cookies.get('access_token') !== undefined);
    }, [pathname])

    return isAuthenticated;
}