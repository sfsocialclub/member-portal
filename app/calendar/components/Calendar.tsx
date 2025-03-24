import { DayPicker, Modifiers, MonthChangeEventHandler } from "react-day-picker";
import { CalendarEvent } from "../models";
import { useAppSelector } from "@/lib/hooks";
import { userApi } from "@/lib/user/userApi";

export type CalendarProps = {
    onDayClick?(day: Date, modifiers: Modifiers): void
    onMonthChange:MonthChangeEventHandler
}

export const Calendar = ({ onDayClick, onMonthChange }: CalendarProps) => {
    const userId = useAppSelector(state => state.auth.userId)
    const { data, isFetching } = userApi.useGetUserQuery(userId!)
    const events = (data?.events || [])


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