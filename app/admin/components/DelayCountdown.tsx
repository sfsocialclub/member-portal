"use client"
import { useEffect } from "react";

export const DEFAULT_SCAN_DELAY = 3500;

export const DelayCountdown = ({ countdown, setCountdown, isDelayed, setIsDelayed }: { countdown?: number, setCountdown: React.Dispatch<React.SetStateAction<number | undefined>>, isDelayed: boolean, setIsDelayed: React.Dispatch<React.SetStateAction<boolean>> }) => {
    useEffect(() => {
        let intervalId: NodeJS.Timer;

        if (isDelayed) {
            intervalId = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown) {
                        if (prevCountdown <= 0) {
                            setIsDelayed(false);
                            return undefined; // reset countdown to 3.5 seconds
                        }
                        return prevCountdown - 100; // decrement by 0.1 seconds
                    }
                });
            }, 100); // update every 100ms
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [isDelayed]);

    const countdownSeconds = countdown ? countdown : 3500;

    return (
        <div className={`flex gap-x-4 items-center ${countdown ? "" : "opacity-0"} transition-opacity`}>
            <p>Next scan in: </p>
            <div className="radial-progress"
                style={{"--size":"2rem", "--value": Math.floor((countdownSeconds / DEFAULT_SCAN_DELAY) * 100) } as React.CSSProperties}
                aria-valuenow={Math.floor((countdownSeconds / DEFAULT_SCAN_DELAY) * 100)}
                role="progressbar">
                <span className="text-[.7rem]">{Math.floor(countdownSeconds / 1000)}.{Math.floor((countdownSeconds / 1000 % 1) * 10)}s</span>
            </div>
        </div>
    )
}