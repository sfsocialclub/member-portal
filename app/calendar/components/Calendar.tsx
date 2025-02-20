import { DayPicker, Modifiers } from "react-day-picker";
import { CalendarEvent } from "../models";

export type CalendarProps = {
    events: CalendarEvent[]
    onDayClick?(day: Date, modifiers: Modifiers): void
}

export const Calendar = ({ events, onDayClick }: CalendarProps) => {
    const handleOnSelect = () => {
        return;
    }

    const datesFromEvents = events.map((event) => (new Date(event.startDateTime)))

    return (
        <>
            <DayPicker
                className="react-day-picker"
                selected={datesFromEvents}
                mode="multiple"
                onSelect={handleOnSelect}
                onDayClick={onDayClick}
            />
        </>
    )
}