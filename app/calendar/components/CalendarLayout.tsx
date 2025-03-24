import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { userApi } from "@/lib/user/userApi";
import { setSelectedDate, setMonth, setYear } from "../calendarSlice";
import { Calendar, CalendarProps } from "./Calendar"
import { DayOfEventsList } from "./DayOfEventsList"
import { Month } from "react-day-picker";
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
    const userId = useAppSelector(state => state.auth.userId)
    const dispatch = useAppDispatch();
    const { data } = userApi.useGetUserQuery(userId!)
    const events = (data?.events || []).map(event => ({
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