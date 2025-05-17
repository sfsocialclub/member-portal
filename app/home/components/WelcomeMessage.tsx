import { useAppSelector } from "@/lib/hooks";
import { userApi } from "@/lib/user/userApi";

// Demo of re-usable component with RTK
export const WelcomeMessage = () => {
    const userId = useAppSelector(state => state.auth.userId)
    const { data } = userApi.useGetUserQuery(userId!, { skip: !userId });

    if (!data?.name) return null

    const dateJoined = new Date(data.dateJoined)
    const formattedDateJoined = dateJoined.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }).replace(",", "")

    return (
        <div className="flex flex-col w-full">
            <h1 className="text-base-content mb-4">
                <span className="text-4xl font-[Dm_Sans] font-semibold">{data.name}</span>
            </h1>
            <p className="text-xs">Joined: {formattedDateJoined}</p>
        </div>)
}