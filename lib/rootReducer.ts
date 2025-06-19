import { combineReducers } from "@reduxjs/toolkit";
import { optimisticPathReducer } from "./navigation/optimisticPathSlice";
import calendarReducer from "../app/calendar/calendarSlice";
import { baseApi } from "@/lib/baseApi";
import { slackApi } from "./slack/api";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [slackApi.reducerPath]: slackApi.reducer,
  optimisticPath: optimisticPathReducer,
  calendar: calendarReducer
});

export default rootReducer;
