import { eventsApi } from "@/lib/eventsApi";
import { useAppDispatch, useAppSelector, useAppSession } from "@/lib/hooks";
import { setMonth, setSelectedDate, setYear } from "../calendarSlice";
import { Calendar, CalendarProps } from "./Calendar";
import { DayOfEventsList } from "./DayOfEventsList";
import { MonthPicker } from "./MonthPicker";

function isWithin24Hours(midnightDate: Date, arbitraryDate: Date) {
    // Ensure both inputs are Date objects
    if (!(midnightDate instanceof Date) || !(arbitraryDate instanceof Date)) {
        throw new Error("Both inputs must be valid Date objects");
    }

    // Get the timestamp of midnight and midnight + 24 hours
    const midnightTimestamp = midnightDate.getTime();
    const twentyFourHoursLater = midnightTimestamp + 24 * 60 * 60 * 1000;

    // Get the timestamp of the arbitrary date
    const arbitraryTimestamp = arbitraryDate.getTime();

    // Check if the arbitrary timestamp is within the range
    return arbitraryTimestamp >= midnightTimestamp && arbitraryTimestamp < twentyFourHoursLater;
}

export const CalendarLayout = () => {
    const userData = useAppSession();
    const dispatch = useAppDispatch();
    const { data } = eventsApi.useGetEventsQuery();
    const events = (data || []).map(event => ({
        ...event,
        startDateTime: new Date(event.startDateTime).toLocaleString("en-US")
      }));

    const { selectedDate } = useAppSelector((state) => state.calendar);

    const handleOnDayClick: CalendarProps['onDayClick'] = (day) => {
        dispatch(setSelectedDate(day.toDateString()))
    }

    const handleOnMonthChange: CalendarProps['onMonthChange'] = (month: Date) => {
        const selectedMonth = month.getMonth();
        const selectedYear = month.getFullYear();
        dispatch(setMonth(selectedMonth));
        dispatch(setYear(selectedYear));
        dispatch(setSelectedDate(undefined))
    }

    const eventsForSelectedDate = selectedDate ? events.filter(event => {
        return isWithin24Hours(new Date(selectedDate), new Date(event.startDateTime))
    }) : []
    
    return (
        <>
            <MonthPicker/>
            <Calendar
                onDayClick={handleOnDayClick}
                onMonthChange={handleOnMonthChange}
            />
            <DayOfEventsList day={selectedDate ? new Date(selectedDate) : undefined} events={eventsForSelectedDate} />
        </>
    )
}