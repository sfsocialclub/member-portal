'use client';
import { store } from "@/lib/store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { PullToRefresh } from "./components/PullToRefresh";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { ProtectedPageLayout } from "./ProtectedPageLayout";
import ProtectedRouteProvider from "./ProtectedRouteProvider";

export const Providers = ({ children, session }: { children: React.ReactNode, session: any }) => {

    const handleRefresh = async () => {
        window.location.reload();
    };
    return (
        <SessionProvider session={session} basePath="/api/auth">
            <Provider store={store}>
                <OnboardingWrapper>
                    <PullToRefresh onRefresh={handleRefresh}>
                        <ProtectedRouteProvider>
                            <ProtectedPageLayout>
                                {children}
                            </ProtectedPageLayout>
                        </ProtectedRouteProvider>
                    </PullToRefresh>
                </OnboardingWrapper>
            </Provider>
        </SessionProvider>
    )
}