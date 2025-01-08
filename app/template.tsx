"use client";

import Cookies from "js-cookie";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { authApi } from "../lib/auth/authApi";
import { authSlice } from "../lib/auth/authSlice";
import LoadingPage from "./components/loadingPage";
import { useRouterWithOptimisticPathname } from "./hooks/useOptimisticRouter";

export default function ProtectedRouteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = useAppSelector((state) => state.auth.role);
  const dispatch = useAppDispatch();
  const [load] = authApi.useLazyLoadQuery();
  const [loading, setLoading] = useState(true);
  const router = useRouterWithOptimisticPathname();
  const { optimisticPath: pathname, isPublicRoute } = router;
  const isAdminRoute = pathname === "/admin";

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Obtain the session from the cookie
      const accessToken = Cookies.get("access_token");

      // 2. Redirect to /login if the user is not authenticated
      if (!accessToken) {
        setLoading(false);
        if (["/login", "/signup"].includes(pathname)) return;
        if (pathname !== "/login") router.push("/login");
        return;
      }

      // 3. Get session on page load
      if (!role) {
        setLoading(true);
        load()
          .then(({ data, error }) => {
            if (data) {
              dispatch(authSlice.actions.setRole(data.role));
              dispatch(authSlice.actions.setUserId(data.userId));
            } else if (error) {
              throw error;
            }
          })
          .catch((err) => {
            Cookies.remove("access_token");
            router.push("/login");
          });
      } else {
        setLoading(false);

        // 4. Redirect admin route attempt for a non-admin user to /member
        if (isAdminRoute && role !== "admin") {
          console.log();
          router.push("/member");
          return;
        }

        // 5. Redirect public routes to role route if the user is authenticated
        if (isPublicRoute) {
          router.push("/home");
        }
      }
    };

    checkAuth();
  }, [pathname, role]);

  // Render the loading component while checking auth on non-login routes
  return loading && !isPublicRoute ? <LoadingPage /> : <>{children}</>;
}
