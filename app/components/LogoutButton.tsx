'use client'
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export const LogoutButton = () => {
    const router = useRouter();
    const handleClick = () => {
        Cookies.remove('access_token')
        router.push('/login')
    }
    return <button className="btn btn-neutral"
        onClick={handleClick}>Log out</button>
}