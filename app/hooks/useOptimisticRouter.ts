import { useAppSelector } from "@/lib/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { RootState } from "../../lib/store";
import { setOptimisticPath } from "@/lib/navigation/optimisticPathSlice";

// 1. Specify public routes
const publicRoutes = ["/login", "/signup", "/"];

export function useRouterWithOptimisticPathname() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const optimisticPath = useAppSelector(
    (state: RootState) => state.optimisticPath.path
  );

  function push(newPath: string) {
    dispatch(setOptimisticPath(newPath));
    router.push(newPath);
  }  

  // 2. Check if the current route is protected or public
  const isPublicRoute = publicRoutes.includes(pathname)

  return {
    // handles initial load edge case
    optimisticPath: optimisticPath.length === 0 ? pathname : optimisticPath,
    push,
    replace: router.replace,
    isPublicRoute,
  };
}
