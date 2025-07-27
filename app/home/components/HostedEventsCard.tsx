'use client';
import { EventDetails } from "@/app/calendar/components/DayOfEventsList";
import { CalendarEvent } from "@/app/calendar/models";
import { useGetEventsQuery } from "@/lib/eventsApi";
import CircularProgress from "@mui/material/CircularProgress";

export const HostedEventsCard = () => {
    const { data, isFetching } = useGetEventsQuery();
    const eventsUserIsHosting = data?.filter(event => {
        const isWithin72HoursAgo = new Date().getTime() - new Date(event.startDateTime).getTime() < 72 * 60 * 60 * 1000;
        const isWithin2WeeksFromNow = new Date(event.startDateTime).getTime() - new Date().getTime() < 14 * 24 * 60 * 60 * 1000;
        return isWithin72HoursAgo && isWithin2WeeksFromNow && event.userIsHost
    }) || []

    if(isFetching) {
        return (<CircularProgress sx={{ marginX: "auto"}} />)
    }

    if (eventsUserIsHosting.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-y-4">
            <h2 className="font-semibold">Events you're hosting</h2>
            {
                eventsUserIsHosting.map((event: CalendarEvent) => {
                    const day = new Date(event.startDateTime);
                    const dayOfMonth = day?.getDate();
                    const month = day?.toLocaleDateString("en-US", { month: "long" })
                    const dayOfWeek = day?.toLocaleDateString("en-US", { weekday: "long" })
                    return (
                        <div key={event.id} className="p-4 bg-white rounded-[20px]">
                            <div className="font-bold text-xs mb-2 text-primary">{dayOfWeek}, {month} {dayOfMonth}</div>
                            <EventDetails event={event} hideBadges />
                        </div>
                    )
                })
            }
        </div>
    )
}