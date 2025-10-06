"use client";

import { useAppSession } from "@/lib/hooks";
import { useEffect, useState } from "react";
import LoadingPage from "./components/loadingPage";
import { useRouterWithOptimisticPathname } from "./hooks/useOptimisticRouter";

export default function ProtectedRouteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useAppSession();
  const [loading, setLoading] = useState(true);
  const router = useRouterWithOptimisticPathname();
  const { optimisticPath: pathname, isPublicRoute } = router;
  const isAdminRoute = pathname.startsWith("/admin");
  const isRootPath = pathname === "/"

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Get session on page load
      if (!session) {
        setLoading(true);
        if (!isPublicRoute) {
          router.push("/login");
        } else {
          if (isRootPath) {
            router.replace("/login");
          }
        }
      } else {
        setLoading(false);

        // 2. Redirect admin route attempt for a non-admin user to /home
        if (isAdminRoute && !session.user.isAdmin) {
          router.push("/home");
          return;
        }

        // 3. Redirect public routes to role route if the user is authenticated
        if (isPublicRoute) {
          router.push("/home");
        }
      }
    };

    checkAuth();
  }, [pathname]);


  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
  }

  // Render the loading component while checking auth on non-login routes
  return loading && !isPublicRoute ? <LoadingPage /> : <>{children}</>;
}
