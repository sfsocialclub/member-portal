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
            <h1 className="text-3xl text-base-content">
                <span className="font-semibold">{data.name}</span>
            </h1>
            <p>Joined: {formattedDateJoined}</p>
        </div>)
}