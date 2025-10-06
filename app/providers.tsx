'use client';
import { store } from "@/lib/store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { ProtectedPageLayout } from "./ProtectedPageLayout";
import ProtectedRouteProvider from "./ProtectedRouteProvider";
import { OnboardingWrapper } from "./OnboardingWrapper";

export const Providers = ({ children, session }: { children: React.ReactNode, session: any }) => {
    return (
        <SessionProvider session={session} basePath="/api/auth">
            <Provider store={store}>
                <OnboardingWrapper>
                    <ProtectedRouteProvider>
                        <ProtectedPageLayout>
                            {children}
                        </ProtectedPageLayout>
                    </ProtectedRouteProvider>
                </OnboardingWrapper>
            </Provider>
        </SessionProvider>
    )
}