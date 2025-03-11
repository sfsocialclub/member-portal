import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setMonth, setSelectedDate, setYear } from "../calendarSlice";

export const MonthPicker = () => {
    const {month, year} = useAppSelector((state) => state.calendar);
    const dispatch = useAppDispatch();

    const handlePrevMonth = () => {
        dispatch(setSelectedDate(undefined))
        const newMonth = month - 1;
        const newYear = newMonth < 0 ? year - 1 : year;
        dispatch(setMonth(newMonth < 0 ? 11 : newMonth));
        if (newMonth < 0) dispatch(setYear(newYear));
      };
    
      const handleNextMonth = () => {
        dispatch(setSelectedDate(undefined))
        const newMonth = month + 1;
        const newYear = newMonth > 11 ? year + 1 : year;
        dispatch(setMonth(newMonth > 11 ? 0 : newMonth));
        if (newMonth > 11) dispatch(setYear(newYear));
      };
    return (
        <>
            <div className="flex items-center gap-x-2 ml-auto">
                <p>{new Date(year, month).toLocaleString("en-US", { month: "long", year: "numeric" })} Events</p>
                <button onClick={handlePrevMonth}>{'<'}</button>
                <button onClick={handleNextMonth}>{'>'}</button>
            </div>
            <p>Events you’ve RSVP’d to this month</p>
        </>
    )
}