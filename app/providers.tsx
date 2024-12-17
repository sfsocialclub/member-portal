'use client';
import { Provider } from "react-redux";

import { store } from "@/lib/store";
import ProtectedRouteProvider from "./template";
import { ProtectedPageLayout } from "./ProtectedPageLayout";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <ProtectedRouteProvider>
                <ProtectedPageLayout>
                    {children}
                </ProtectedPageLayout>
            </ProtectedRouteProvider>
        </Provider>
    )
}