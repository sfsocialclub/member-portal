import { combineReducers } from "@reduxjs/toolkit";
import { optimisticPathReducer } from "./navigation/optimisticPathSlice";
import calendarReducer from "../app/calendar/calendarSlice";
import { baseApi } from "@/lib/baseApi";
import { authSliceReducer } from "./auth/authSlice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  optimisticPath: optimisticPathReducer,
  auth: authSliceReducer,
  calendar: calendarReducer
});

export default rootReducer;
