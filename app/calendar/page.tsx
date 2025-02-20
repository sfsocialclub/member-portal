'use client';

import { useState } from "react";
import { Calendar, CalendarProps } from "./components/Calendar";
import { UserCalendarEvent } from "./models";
import { DayOfEventsList } from "./components/DayOfEventsList";
import { CalendarLayout, ViewPicker } from "./components/ViewPicker";
import { userApi } from "@/lib/user/userApi";
import { useAppSelector } from "@/lib/hooks";

function filterEventsByMonth(events: UserCalendarEvent[], year: number, month:number) {
  return events.filter(event => {
    const eventDate = new Date(event.startDateTime);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
}

function groupEventsByDay(events: UserCalendarEvent[]) {
  const grouped = events.reduce((acc, event) => {
    const eventDate = new Date(event.startDateTime);
    const dateKey = eventDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);

    return acc;
  }, {} as {[dateKey:string]: UserCalendarEvent[]});

  return Object.values(grouped);
}

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

export default function CalendarPage() {
  const userId = useAppSelector(state => state.auth.userId)
  const { data, isFetching } = userApi.useGetUserQuery(userId!)
  const events = data?.events || [];
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [activeLayout, setActiveLayout] = useState<CalendarLayout>(CalendarLayout.list);

  const handleOnDayClick: CalendarProps['onDayClick'] = (day) => {
    setSelectedDate(day)
  }

  const eventsForSelectedDate = selectedDate ? events.filter(event => {
    return isWithin24Hours(selectedDate, new Date(event.startDateTime))
  }) : []

  if(isFetching) { return null }

  return <div className="flex items-center h-full p-6 flex-col gap-y-4 w-full">
      <ViewPicker activeLayout={activeLayout} setActiveLayout={setActiveLayout}/>
      {activeLayout === CalendarLayout.calendar ? (
        <>
          <Calendar
            events={events}
            onDayClick={handleOnDayClick}
          />
          <DayOfEventsList day={selectedDate} events={eventsForSelectedDate} />
        </>
      ) : (
        <>
          {groupEventsByDay(filterEventsByMonth(events, 2025, 1)).map((eventsOnDay) => {
            return <DayOfEventsList key={eventsOnDay[0].startDateTime} day={new Date(eventsOnDay[0].startDateTime)} events={eventsOnDay}/>
          })}
        </>
      )}

  </div>;
}
