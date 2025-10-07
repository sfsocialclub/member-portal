"use client"
import { useGetEventsQuery } from "@/lib/eventsApi";
import { useScanMutation } from "@/lib/scanner/scannerApi";
import { IDetectedBarcode, IScannerProps } from "@yudiel/react-qr-scanner";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DEFAULT_SCAN_DELAY, DelayCountdown } from "./components/DelayCountdown";
import { QRScanner } from "./components/QRScanner";
import { useAppSession } from "@/lib/hooks";

/**
 * Renders QR Scanner to send decrypted value to backend
 * 
 */
export default function EventHostPage() {
    const session = useAppSession();
    const [lastScannedCodes, setLastScannedCodes] = useState<IDetectedBarcode[]>([]);
    const [clientSideError, setClientSideError] = useState<string | null>(null);
    const { data: events, isFetching: isEventsFetching } = useGetEventsQuery();
    const [scanRequest, scanRequestResult] = useScanMutation();
    const [scanDelay, setScanDelay] = useState<number>();
    const [isDelayed, setIsDelayed] = useState(false);
    const [alertAllowed, setAlertAllowed] = useState(false);
    const params = useParams();
    const selectedEventId = typeof params.eventId === 'string' ? params.eventId : '';

    const event = events?.find((event) => event.id === selectedEventId)

    /**
     * Callback when QRScanner component detects multiple codes
     * - Resets result
     * - Stores codes in state
     * - Sends last code in array to backend if it is a JSON object containing 'slackId'
     * 
     * @param detectedCodes - array of objects with raw values, formats, and other metadata
     */
    const handleScan: IScannerProps['onScan'] = (detectedCodes) => {
        setAlertAllowed(true);
        setIsDelayed(true);
        setClientSideError(null);
        setLastScannedCodes(detectedCodes);
        const lastDetectedCode = [...detectedCodes].pop()
        if (lastDetectedCode) {
            try {
                const rawValueAsJson = JSON.parse(lastDetectedCode?.rawValue)
                if ('slackId' in rawValueAsJson) {
                    scanRequest({ slackId: rawValueAsJson.slackId, eventId: selectedEventId })
                } else {
                    throw new SyntaxError('Code unrecognized')
                }
            } catch (error) {
                console.error(error)
                if (error instanceof SyntaxError) {
                    setClientSideError(error.message)
                }
            }

        }
        setScanDelay(DEFAULT_SCAN_DELAY)
    }

    const errorMessage = clientSideError || (scanRequestResult?.error as { data?: any })?.data?.error;
    const scanRequestMessage = scanRequestResult.data?.message;

    const isAdmin = session?.user?.isAdmin || false;
    const isHost = event?.userIsHost;
    const canScan = isAdmin || isHost;

    if(isEventsFetching) {
        return (
            <span className="loading loading-dots loading-lg"></span>
        )
    }

    if(!event) return (
        <div className="w-full h-screen flex items-center justify-center">
            <p className="text-base">Event not found</p>
        </div>
    )

    if(!canScan) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-base">Unauthorized</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 max-w-md w-full">
            <div className="flex flex-col gap-2 w-full">
                <span>You're scanning for</span>
                <h3 className="text-3xl font-[Dm_Sans_Variable] font-bold">{event.name}</h3>
                <p className="text-sm">Event starts at {new Date(event.startDateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, "day": "numeric", month: "long", year: "numeric" })}</p>
            </div>

            {
                !!selectedEventId && (
                    <>
                        <div className="max-w-md">
                            <QRScanner onScan={handleScan} />
                        </div>
                        {
                            alertAllowed && errorMessage && (
                                <div role="alert" className="alert alert-error text-white flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errorMessage}</span>
                                    </div>
                                    <div>
                                        <button onClick={() => setAlertAllowed(false)} className="btn btn-sm btn-soft btn-error">Dismiss</button>
                                    </div>
                                </div>
                            )
                        }
                        {
                            alertAllowed && scanRequestMessage && (
                                <div role="alert" className="alert alert-success flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{scanRequestMessage}</span>
                                    </div>
                                    <div>
                                        <button onClick={() => setAlertAllowed(false)} className="btn btn-sm btn-success">Dismiss</button>
                                    </div>
                                </div>
                            )
                        }
                        <DelayCountdown
                            countdown={scanDelay}
                            setCountdown={setScanDelay} 
                            isDelayed={isDelayed}
                            setIsDelayed={setIsDelayed}
                        />
                    </>
                )
            }
        </div>
    );
}