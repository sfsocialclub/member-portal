import { UserCalendarEvent } from "../models";

type DayOfEventsListProps = {
    day?: Date
    events: UserCalendarEvent[];
}

type EventRowProps = {
    event: UserCalendarEvent;
}

const EventDetails = ({ event }: EventRowProps) => {
    const date = new Date(event.startDateTime);
    const timeOfDay = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase().replace(" ", "");

    const badgeClass = {
        "attended": "badge-outline badge-success",
        "maybe": "badge-soft badge-neutral",
        "no": "badge-outline badge-error"
    }

    return (
        <div>
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col">
                    <div className="flex gap-x-2 items-center">
                        <h5 className="font-bold text-lg">{event.name}</h5>
                        <div className={`capitalize text-xs badge px-2 rounded-xl min-w-4 ${badgeClass[event.status]}`}>{event.status}</div>
                    </div>
                    <div className="text-sm">{timeOfDay} @ {event.location.name} • {`${event.points}pts`}</div>
                </div>
                <p className="text-xs">{event.description}</p>
            </div>
        </div>
    )
}

export const DayOfEventsList = ({ day, events }: DayOfEventsListProps) => {
    const dayOfMonth = day?.getDate();
    const month = day?.toLocaleDateString("en-US", { month: "long" })
    const dayOfWeek = day?.toLocaleDateString("en-US", { weekday: "long" })

    return (
        <div className="bg-white rounded-[20px]">
            {(!day || events.length === 0) ? (
                <p className="p-10 font-bold text-center text-2xl">Select an event date in the calendar to see details</p>
            ) : (
                <div className="p-4">
                    <div className="font-bold text-xs mb-8">{dayOfWeek}, {month} {dayOfMonth}</div>
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