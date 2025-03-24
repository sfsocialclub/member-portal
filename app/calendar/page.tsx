'use client';

import { useAppSelector } from "@/lib/hooks";
import { CalendarLayout as CalendarView } from "./components/CalendarLayout";
import { ListLayout } from "./components/ListLayout";
import { CalendarLayout, ViewPicker } from "./components/ViewPicker";



export default function CalendarPage() {
  const { activeLayout } = useAppSelector((state) => state.calendar);

  return <div className="flex items-center h-full flex-col gap-y-4 w-full">
      <div className="flex flex-col items-center gap-y-4 max-w-lg w-full">
      <ViewPicker activeLayout={activeLayout}/>
        {activeLayout === CalendarLayout.calendar ? (
          <CalendarView/>
        ) : (
          <ListLayout />
        )}
      </div>
  </div>;
}
