import { useAppSelector } from "@/lib/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { RootState } from "../../lib/store";
import { setOptimisticPath } from "@/lib/navigation/optimisticPathSlice";
import { useEffect } from "react";

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

  return {
    // handles initial load edge case
    optimisticPath: optimisticPath.length === 0 ? pathname : optimisticPath,
    push,
  };
}
