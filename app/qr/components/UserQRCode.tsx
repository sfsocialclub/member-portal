import { useAppSession } from "@/lib/hooks";
import { QRCodeSVG } from "qrcode.react";

export const UserQRCode = () => {
    const session = useAppSession();

    return (
        <>
            <div className="mt-10 px-7 py-8 bg-white shadow rounded-[20px] flex flex-col items-center space-y-2">
                <h2 className="text-xl font-semibold mb-4">Show this to the SF Social Club host</h2>
                <QRCodeSVG value={JSON.stringify({ userId: session.user.id })} size={256} />
                <p className="mt-2 text-sm text-gray-500">Member ID: {session.user.id}</p>
            </div>
        </>
    )
}