import { useAppSelector, useAppSession } from "@/lib/hooks";
import { userApi } from "@/lib/user/userApi";
import { UserCalendarEvent } from "../models";
import { DayOfEventsList } from "./DayOfEventsList";
import { MonthPicker } from "./MonthPicker";

function filterEventsByMonth(events: UserCalendarEvent[], year: number, month: number) {
    return events.filter(event => {
        const eventDate = new Date(event.startDateTime);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
}
function groupEventsByDay(events: UserCalendarEvent[]) {
    const grouped = events.reduce((acc, event) => {
        const eventDate = new Date(event.startDateTime);
        const dateKey = eventDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);

        return acc;
    }, {} as { [dateKey: string]: UserCalendarEvent[] });

    return Object.values(grouped);
}

export const ListLayout = () => {
    const userData = useAppSession();
    const userId = userData.user.id
    const { data } = userApi.useGetUserQuery(userId!)
    const { year, month } = useAppSelector((state) => state.calendar);

    const events = data?.events || [];
    const eventsThisMonth = groupEventsByDay(filterEventsByMonth(events, year, month))
    
    return (
        <>
            <MonthPicker/>
            {
                eventsThisMonth.length === 0 ? (
                    <div className="bg-white rounded-[20px] w-full">
                        <p className="p-10 font-bold text-center text-xl text-primary">No events found for {new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                    </div>
                ) : (
                    eventsThisMonth.map((eventsOnDay) => {
                        return <DayOfEventsList key={eventsOnDay[0].startDateTime} day={new Date(eventsOnDay[0].startDateTime)} events={eventsOnDay} />
                    })
                )
            }
        </>
    )
}