// features/calendarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarLayout } from './components/ViewPicker';

interface CalendarState {
  selectedDate: string | undefined;
  activeLayout: CalendarLayout;
  year: number;
  month: number;
}

const initialState: CalendarState = {
  selectedDate: undefined,
  activeLayout: CalendarLayout.calendar,
  year: 2025,
  month: 2,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string | undefined>) {
      state.selectedDate = action.payload;
    },
    setActiveLayout(state, action: PayloadAction<CalendarLayout>) {
      state.activeLayout = action.payload;
    },
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload;
    },
    setMonth(state, action: PayloadAction<number>) {
      state.month = action.payload;
    },
  },
});

export const {
  setSelectedDate,
  setActiveLayout,
  setYear,
  setMonth,
} = calendarSlice.actions;

export default calendarSlice.reducer;