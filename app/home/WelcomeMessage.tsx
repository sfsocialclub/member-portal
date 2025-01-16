import { useAppSelector } from "@/lib/hooks";
import { userApi } from "@/lib/user/userApi";

// Demo of re-usable component with RTK
export const WelcomeMessage = () => {
    const userId = useAppSelector(state => state.auth.userId)
    const { data }= userApi.useGetUserQuery(userId!, {skip: !userId});

    if(!data?.name) return null
    
    return  <h1 className="p-4 lg:p-0 text-3xl text-base-content"><span className="font-semibold">Hi, {data.name}!</span> <em>Welcome to your Dashboard.</em> </h1>
}