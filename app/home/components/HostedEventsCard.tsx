import { EventDetails } from "@/app/calendar/components/DayOfEventsList";
import { CalendarEvent } from "@/app/calendar/models";
import { Card } from "@/lib/card";
import { useGetEventsQuery } from "@/lib/eventsApi"
import { useRouter } from "next/navigation";

export const HostedEventsCard = () => {
    const { data } = useGetEventsQuery();
    const eventsUserIsHosting = data?.filter(event => event.userIsHost) || []
    const router= useRouter();

    if(eventsUserIsHosting.length === 0) {
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
                    <EventDetails event={event} hideBadges/>
                </div>
                // <Card
                //     title={`${event.name}`}
                //     description={`${new Date(event.startDateTime).toLocaleString("en-US")} @ ${event.location.name}`}
                //     buttonProps={{ text: 'Go to scan', onClick: () => router.push(`/qr/${event.id}`) }}
                // />
            )
        })
        }
        </div>
        

    )
}