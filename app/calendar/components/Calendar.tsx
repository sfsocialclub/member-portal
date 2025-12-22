import { eventsApi } from "@/lib/eventsApi";
import { useAppSelector, useAppSession } from "@/lib/hooks";
import { formatDateToLocaleStringLA } from "@/lib/util/dateFormatters";
import { DayPicker, Modifiers, MonthChangeEventHandler } from "react-day-picker";

export type CalendarProps = {
    onDayClick?(day: Date, modifiers: Modifiers): void
    onMonthChange:MonthChangeEventHandler
}

export const Calendar = ({ onDayClick, onMonthChange }: CalendarProps) => {
    const userData = useAppSession();
    const { data } = eventsApi.useGetEventsQuery();
    const events = (data || []).map(event => ({
        ...event,
        startDateTime: formatDateToLocaleStringLA(event.startDateTime)
      }));
    // TODO: Get all Events

    const {month, year} = useAppSelector((state) => state.calendar)
    const handleOnSelect = () => {
        return;
    }

    const datesFromEvents = events.map((event) => (new Date(event.startDateTime)))

    return (
        <>
            <DayPicker
                month={new Date(year, month)}
                className="react-day-picker"
                selected={datesFromEvents}
                mode="multiple"
                onSelect={handleOnSelect}
                onDayClick={onDayClick}
                onMonthChange={onMonthChange}
                hideNavigation
            />
        </>
    )
}