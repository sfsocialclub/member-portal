import { Navbar } from "./components/NavLinks"
import { useRouterWithOptimisticPathname } from "./hooks/useOptimisticRouter"

export const ProtectedPageLayout = ({ children }: { children: React.ReactNode }) => {
    const { isPublicRoute } = useRouterWithOptimisticPathname()
    return (
        <div className="flex flex-col w-full h-full">
            {!isPublicRoute && <Navbar />}
            {children}
        </div>
    )
}