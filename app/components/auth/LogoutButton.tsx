'use client'
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export const LogoutButton = () => {
    const router = useRouter();
    const handleClick = () => {
        Cookies.remove('access_token')
        Cookies.remove('role')
        router.push('/login')
    }
    return <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleClick}>Log out</button>
}