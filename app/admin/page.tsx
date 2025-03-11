"use client"
import { IDetectedBarcode, IScannerProps } from "@yudiel/react-qr-scanner";
import { QRScanner } from "./components/QRScanner";
import { useState } from "react";
import { useScanMutation } from "@/lib/scanner/scannerApi";
import { useGetEventsQuery } from "@/lib/eventsApi";

/**
 * Renders proof of concept QR Scanner to send decrypted value to backend
 * 
 * TODO: Separate QR Scanner feature in another admin page or section
 * TODO: Handle appropriate scenarios for QR scan
 */
export default function AdminPage() {
    const [lastScannedCodes, setLastScannedCodes] = useState<IDetectedBarcode[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const { data: events, isFetching: isEventsFetching } = useGetEventsQuery({ today: true });
    const [scan] = useScanMutation();

    /**
     * Callback when QRScanner component detects multiple codes
     * - Resets result
     * - Stores codes in state
     * - Sends last code in array to backend if it is a JSON object containing 'userId'
     * 
     * @param detectedCodes - array of objects with raw values, formats, and other metadata
     */
    const handleScan: IScannerProps['onScan'] = (detectedCodes) => {
        setResult(null);
        setLastScannedCodes(detectedCodes);
        const lastDetectedCode = [...detectedCodes].pop()
        if (lastDetectedCode) {
            try {
                const rawValueAsJson = JSON.parse(lastDetectedCode?.rawValue)
                if ('userId' in rawValueAsJson) {
                    scan({ userId: rawValueAsJson.userId, eventId: selectedEventId }).then(({ data }) => {
                        if (data) {
                            setResult(data.message)
                        }
                    })
                } else {
                    throw new SyntaxError('Code unrecognized')
                }
            } catch (error) {
                console.error(error)
                if (error instanceof SyntaxError) {
                    setResult(error.message)
                }
            }

        }
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
                        <div className="flex items-center flex-col">
                            <div>Scanned:</div>
                            <pre className="whitespace-pre-wrap w-full">{JSON.stringify(lastScannedCodes.map(({ rawValue, format }) => ({ rawValue, format })), null, 2)}</pre>
                            <div>
                                <div>API Response:</div>
                                <div>{result}</div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
}