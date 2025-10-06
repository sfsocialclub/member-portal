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
            <div className="flex flex-col items-center gap-y-2 w-full">
                <div className="flex items-center gap-x-2 w-full">
                    <p className="text-xl font-[Dm_Sans_Variable] font-semibold mr-auto">{new Date(year, month).toLocaleString("en-US", { month: "long", year: "numeric" })} Events</p>
                    <button className="text-xl mr-2 cursor-pointer" onClick={handlePrevMonth}>{'<'}</button>
                    <button className="text-xl cursor-pointer" onClick={handleNextMonth}>{'>'}</button>
                </div>
                <p className="text-xs w-full italic">All events are shown in local time</p>
            </div>
        </>
    )
}