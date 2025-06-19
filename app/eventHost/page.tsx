"use client"
import { IDetectedBarcode, IScannerProps } from "@yudiel/react-qr-scanner";
import { QRScanner } from "./components/QRScanner";
import { useState } from "react";
import { useScanMutation } from "@/lib/scanner/scannerApi";
import { useGetEventsQuery } from "@/lib/eventsApi";
import { DEFAULT_SCAN_DELAY, DelayCountdown } from "./components/DelayCountdown";

/**
 * Renders proof of concept QR Scanner to send decrypted value to backend
 * 
 * TODO: Separate QR Scanner feature in another admin page or section
 * TODO: Handle appropriate scenarios for QR scan
 */
export default function EventHostPage() {
    const [lastScannedCodes, setLastScannedCodes] = useState<IDetectedBarcode[]>([]);
    const [clientSideError, setClientSideError] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const { data: events, isFetching: isEventsFetching } = useGetEventsQuery({ today: true });
    const [scanRequest, scanRequestResult] = useScanMutation();
    const [scanDelay, setScanDelay] = useState<number>();
    const [isDelayed, setIsDelayed] = useState(false);
    const [alertAllowed, setAlertAllowed] = useState(false);

    /**
     * Callback when QRScanner component detects multiple codes
     * - Resets result
     * - Stores codes in state
     * - Sends last code in array to backend if it is a JSON object containing 'userId'
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
                if ('userId' in rawValueAsJson) {
                    scanRequest({ userId: rawValueAsJson.userId, eventId: selectedEventId })
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

    if(isEventsFetching) {
        return (
            <span className="loading loading-dots loading-lg"></span>
        )
    }

    return (
        <div className="flex flex-col gap-8 max-w-md w-full">
            <div className="flex flex-col gap-2 w-full">
                <p>Select an event to scan for:</p>
                <select defaultValue="default" className="select w-full" onChange={(e) => setSelectedEventId(e.target.value)}>
                    <option key={'default'} disabled={true} value="default">Not Selected</option>
                    {events?.map((event) => (
                        <option key={event.id} value={event.id}>{new Date(event.startDateTime).toLocaleTimeString("en-US", {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }).toLowerCase()} {event.name} - {event.location.name}</option>
                    ))}
                </select>
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