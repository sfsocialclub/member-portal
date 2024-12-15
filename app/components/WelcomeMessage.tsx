import { useAppSelector } from "@/lib/hooks";
import { userApi } from "@/lib/user/userApi";

// Demo of re-usable component with RTK
export const WelcomeMessage = () => {
    const userId = useAppSelector(state => state.auth.userId)
    const { data }= userApi.useGetUserQuery(userId!, {skip: !userId});

    if(!data?.name) return null
    
    return  <p className="block">Welcome {data.name}</p>
}