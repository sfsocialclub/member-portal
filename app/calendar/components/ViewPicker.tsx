import { useAppDispatch } from "@/lib/hooks";
import { ChangeEventHandler } from "react";
import { setActiveLayout } from "../calendarSlice";

export enum CalendarLayout {
    calendar = 'Calendar view',
    list = 'List view'
}

interface ViewPickerProps {
    activeLayout: CalendarLayout,
}

export const ViewPicker = ({ activeLayout }: ViewPickerProps) => {
    const dispatch= useAppDispatch();

    const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) =>{
        dispatch(setActiveLayout(e.target.value as CalendarLayout));
      };

    return (
        <div className="dropdown w-full">
            <select defaultValue={activeLayout} className="select w-full" onChange={handleChange}>
                <option value={CalendarLayout.calendar}>{CalendarLayout.calendar}</option>
                <option value={CalendarLayout.list}>{CalendarLayout.list}</option>
            </select>
        </div>
    )
}