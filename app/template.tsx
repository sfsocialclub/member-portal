"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { authApi } from "../lib/auth/authApi";
import { authSlice } from "../lib/auth/authSlice";
import { useRouterWithOptimisticPathname } from "./hooks/useOptimisticRouter";
import LoadingPage from "./components/loadingPage";

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
  const isRootPath = pathname === "/"

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Get session on page load
      if (!role) {
        setLoading(true);
        if(!isPublicRoute) {
          load()
            .then(({ data, error }) => {
              if (data) {
                dispatch(authSlice.actions.setRole(data.role));
                dispatch(authSlice.actions.setUserId(data.userId));
                setLoading(false);
              } else if (error) {
                throw error;
              }
            })
            .catch((err) => {
              router.push("/login");
            });
        } else {
          if(isRootPath) {
            router.replace("/login");
          }
        }
      } else {
        setLoading(false);

        // 2. Redirect admin route attempt for a non-admin user to /member
        if (isAdminRoute && role !== "admin") {
          router.push("/member");
          return;
        }

        // 3. Redirect public routes to role route if the user is authenticated
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
