import { useAppSession } from "@/lib/hooks";

// Demo of re-usable component with RTK
export const WelcomeMessage = () => {
    const session = useAppSession();

    if (!session.user?.name) return null

    return (
        <div className="flex flex-col w-full">
            <h1 className="text-base-content mb-4">
                <span className="text-4xl font-[Dm_Sans] font-semibold">Welcome <br/> {session.user.name}</span>
            </h1>
        </div>)
}