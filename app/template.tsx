"use client";

import Cookies from "js-cookie";

import { useEffect, useState } from "react";
import LoadingPage from "./components/loadingPage";
import { Provider } from "react-redux";
import { NavLinks } from "./components/NavLinks";
import { authApi } from "../lib/auth/authApi";
import { authSlice } from "../lib/auth/authSlice";
import { useRouterWithOptimisticPathname } from "./hooks/useOptimisticRouter";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function Template({ children }: { children: React.ReactNode }) {
    const role = useAppSelector(state => state.auth.role)
    const dispatch = useAppDispatch();
    const [load] = authApi.useLazyLoadQuery();
    const [loading, setLoading] = useState(true)
    const router = useRouterWithOptimisticPathname();
    const pathname = router.optimisticPath

  // 1. Specify protected and public routes
  const protectedRoutes = ["/admin", "/member"];
  const publicRoutes = ["/login", "/signup", "/"];

  // 2. Check if the current route is protected or public
  const isPublicRoute = publicRoutes.includes(pathname)
  const isAdminRoute = pathname === '/admin'
  const isSignupRoute = router.optimisticPath === "/signup";
  const isLoginRoute = router.optimisticPath === "/login";

    useEffect(() => {
        const checkAuth = async () => {
            // 3. Obtain the session from the cookie
            const accessToken = Cookies.get("access_token");

            // 4. Redirect to /login if the user is not authenticated
            if (!accessToken) {
                if (['/login', '/signup'].includes(pathname)) return;
                if (pathname !== '/login') router.push("/login");
                return;
            }

            // Get session on page load
            if (!role) {
                setLoading(true)
                load().then(({ data, error }) => {
                    if (data) {
                        dispatch(authSlice.actions.setRole(data.role))
                        dispatch(authSlice.actions.setUserId(data.userId))
                    } else if (error) { throw error }
                }).catch((err) => {
                    Cookies.remove('access_token')
                    router.push("/login")
                })
            } else {
                setLoading(false)

                // 5. Redirect admin route attempt for a non-admin user to /member
                if (isAdminRoute && role !== 'admin') {
                    console.log()
                    router.push('/member')
                    return;
                }

                // 6. Redirect public routes to role route if the user is authenticated
                if (
                    isPublicRoute
                ) {
                    router.push(`/${role}`)
                    return;
                }
            }

        };

        checkAuth();
    }, [pathname, role]);

    // Render the loading component while checking auth on non-login routes
    return loading && !isPublicRoute ? <LoadingPage /> :
    <div className="w-full h-full flex items-center justify-center">{children}</div>
}