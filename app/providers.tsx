'use client';
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import ProtectedRouteProvider from "./template";
import { ProtectedPageLayout } from "./ProtectedPageLayout";
import { SessionProvider } from "next-auth/react";

export const Providers = ({ children, session }: { children: React.ReactNode, session:any }) => {
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