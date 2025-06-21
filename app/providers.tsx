'use client';
import { store } from "@/lib/store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { ProtectedPageLayout } from "./ProtectedPageLayout";
import ProtectedRouteProvider from "./ProtectedRouteProvider";

export const Providers = ({ children, session }: { children: React.ReactNode, session: any }) => {
    return (
        <SessionProvider session={session} basePath="/api/auth">
            <Provider store={store}>
                <ProtectedRouteProvider>
                    <ProtectedPageLayout>
                        {children}
                    </ProtectedPageLayout>
                </ProtectedRouteProvider>
            </Provider>
        </SessionProvider>
    )
}