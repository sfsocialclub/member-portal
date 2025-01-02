import { useAppSelector } from "@/lib/hooks"
import { QRCodeSVG } from "qrcode.react"

export const UserQRCode = () => {
    const userId = useAppSelector(state => state.auth.userId) || ''

    return (
        <div className="mt-10 px-4 py-10 bg-white shadow rounded-lg flex flex-col items-center">
            <QRCodeSVG value={JSON.stringify({ userId })} size={128} />
            <p className="mt-2 text-sm text-gray-500">Member ID: {userId}</p>
        </div>
    )
}