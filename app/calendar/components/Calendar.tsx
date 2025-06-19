import { useAppSelector, useAppSession } from "@/lib/hooks";
import { userApi } from "@/lib/user/userApi";
import { DayPicker, Modifiers, MonthChangeEventHandler } from "react-day-picker";

export type CalendarProps = {
    onDayClick?(day: Date, modifiers: Modifiers): void
    onMonthChange:MonthChangeEventHandler
}

export const Calendar = ({ onDayClick, onMonthChange }: CalendarProps) => {
    const userData = useAppSession();
    const { data, isFetching } = userApi.useGetUserQuery(userData.user.id)
    const userEvents = data?.events || [];
    // TODO: Get all Events

    const {month, year} = useAppSelector((state) => state.calendar)
    const handleOnSelect = () => {
        return;
    }

    const datesFromEvents = userEvents.map((event) => (new Date(event.startDateTime)))

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