import { useRouter } from "next/navigation";
import { UserCalendarEvent } from "../models";
import { useAppSession } from "@/lib/hooks";
import Linkify from 'linkify-react';

type DayOfEventsListProps = {
    day?: Date
    events: UserCalendarEvent[];
}

type Props = {
    event: UserCalendarEvent;
    hideBadges?: boolean;
}

export const EventDetails = ({ event, hideBadges }: Props) => {
    const session = useAppSession();
    const date = new Date(event.startDateTime);
    const timeOfDay = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase().replace(" ", "");
    const userIsAdmin = session.user.isAdmin;
    const userIsHost = event.userIsHost;
    const userCanScan = userIsAdmin || userIsHost;
    const router = useRouter();

    const badgeClass = {
        "yes": "badge-outline badge-success",
        "maybe": "badge-soft badge-neutral",
        "no": "badge-outline badge-error"
    }

    return (
        <div>
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col">
                    <div className="flex gap-x-2 items-center">
                        <h5 className="font-bold text-lg">{event.name}</h5>
                        {!hideBadges && (
                            <>
                                {(event.scanned || event.status) && (
                                <div className={`capitalize text-xs badge px-2 rounded-xl min-w-4 ${event.scanned ? "badge-outline badge-success" : event.status ? `${badgeClass[event.status]}` : ''}`}>{event.scanned ? "Attended" : event.status}</div>
                                )}
                                {event.userIsHost && (
                                <div className="capitalize text-xs badge px-2 rounded-xl min-w-4 badge-outline badge-primary">Host</div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="text-sm">{timeOfDay} @ {event.location.name}</div> {/**• {`${event.points}pts`}</div> */}
                </div>
                <Linkify as="p" className="text-xs truncate" options={{attributes: { className: "link link-primary", target: "_blank"}}}>
                    {event.description}
                </Linkify>
                { userCanScan && <button className="btn btn-primary btn-sm w-max ml-auto" onClick={() => { router.push(`/qr/${event.id}`) }}>Go to scan</button>}
            </div>
        </div>
    )
}

export const DayOfEventsList = ({ day, events }: DayOfEventsListProps) => {
    const dayOfMonth = day?.getDate();
    const month = day?.toLocaleDateString("en-US", { month: "long" })
    const dayOfWeek = day?.toLocaleDateString("en-US", { weekday: "long" })

    return (
        <div className="bg-white rounded-[20px] w-full">
            {(!day) ? (
                <p className="p-10 font-bold text-center text-xl text-primary">Select an event date in the calendar to see details</p>
            )
                : (events.length === 0) ? (
                    <p className="p-10 font-extrabold text-center text-xl text-primary">No events for {day.toLocaleDateString("en-US", { day: "numeric", month: "long" })}!</p>
                )
                    : (
                        <div className="p-4">
                            <div className="font-bold text-xs mb-2 text-primary">{dayOfWeek}, {month} {dayOfMonth}</div>
                            <div className="flex flex-col gap-y-6">
                                {events.map((event) => (
                                    <EventDetails key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    )}
        </div>
    )
}