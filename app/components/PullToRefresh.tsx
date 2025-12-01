"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from "@mui/material/Box";

type PullToRefreshProps = {
    children: ReactNode;
    onRefresh: () => Promise<void> | void;
};

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0); // 0–1

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const indicator = container.querySelector<HTMLElement>("[data-indicator]");
        if (!indicator) return;

        let startY = 0;
        let pulling = false;
        let distance = 0;
        let threshold = 80; // will be recalculated based on viewport height

        function getViewportHeight() {
            if (!container) {
                return 0;
            }
            return (
                window.innerHeight ||
                document.documentElement.clientHeight ||
                container.clientHeight ||
                0
            );
        }

        function onTouchStart(e: TouchEvent) {
            if (!container) {
                return;
            }
            if (container.scrollTop !== 0) return;

            const viewportHeight = getViewportHeight();
            if (!viewportHeight) return;

            const touchY = e.touches[0].clientY;

            // Start only if touch begins in top 1/3 of viewport
            const topThird = viewportHeight / 3;
            if (touchY > topThird) return;

            startY = touchY;
            pulling = true;
            distance = 0;
            threshold = viewportHeight * 0.3; // 30% of viewport height
            setProgress(0);
        }

        function onTouchMove(e: TouchEvent) {
            if (!container || !indicator || !pulling) {
                return;
            }

            const currentY = e.touches[0].clientY;
            distance = currentY - startY;

            if (distance > 0) {
                // Prevent viewport bounce
                e.preventDefault();

                // Cap indicator translation for visual sanity
                const translate = Math.min(distance - 70, 50);
                indicator.style.transform = `translateY(${translate}px)`;

                // Raw linear progress [0, 1]
                const raw = distance / threshold;
                const clamped = Math.max(0, Math.min(raw, 1));

                // Eased progress: slow at start, faster near the end
                const eased = clamped * clamped; // quadratic ease-in

                setProgress(eased);

                // Show indicator while pulling
                container.classList.add("ptr-active");
            } else {
                // User moved up instead – cancel
                pulling = false;
                container.classList.remove("ptr-active");
                indicator.style.transform = "translateY(-70px)";
                setProgress(0);
            }
        }

        function onTouchEnd() {
            if (!pulling || !indicator || !container) return;
            pulling = false;

            const shouldRefresh = distance > threshold;

            if (shouldRefresh) {
                setProgress(1);
                Promise.resolve(onRefresh()).finally(() => {
                    container.classList.remove("ptr-active");
                    indicator.style.transform = "translateY(-70px)";
                    setProgress(0);
                });
            } else {
                container.classList.remove("ptr-active");
                indicator.style.transform = "translateY(-70px)";
                setProgress(0);
            }
        }

        container.addEventListener("touchstart", onTouchStart, { passive: true });
        container.addEventListener("touchmove", onTouchMove, { passive: false });
        container.addEventListener("touchend", onTouchEnd);

        return () => {
            container.removeEventListener("touchstart", onTouchStart);
            container.removeEventListener("touchmove", onTouchMove);
            container.removeEventListener("touchend", onTouchEnd);
        };
    }, [onRefresh]);

    // SVG progress math
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="ptr-container" ref={containerRef}>
            <div className="ptr-indicator" data-indicator>
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    aria-hidden="true"
                    className={progress > 0 ? "ptr-icon ptr-icon-visible" : "ptr-icon"}
                >
                    {/* Background circle (track) */}
                    <circle
                        cx="14"
                        cy="14"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.2"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="14"
                        cy="14"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                            transition: "stroke-dashoffset 0.06s linear",
                        }}
                    />
                </svg>
                <RefreshIcon className={progress > 0 ? "ptr-icon ptr-icon-visible" : "ptr-icon"} sx={{ height: 16, width: 16, position: 'absolute' }} />
            </div>
            <div className="ptr-content">{children}</div>
        </div>
    );
}
