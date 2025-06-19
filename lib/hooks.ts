"use client";

import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useSession } from "next-auth/react";
import { SFSCSession } from "./auth/authOptions";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppSession = (): SFSCSession => {
    const session = useSession().data;
    return session as SFSCSession;
}
