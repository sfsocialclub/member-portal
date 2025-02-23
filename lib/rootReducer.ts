import { combineReducers } from "@reduxjs/toolkit";
import { optimisticPathReducer } from "./navigation/optimisticPathSlice";
import { baseApi } from "@/lib/baseApi";
import { authSliceReducer } from "./auth/authSlice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  optimisticPath: optimisticPathReducer,
  auth: authSliceReducer
});

export default rootReducer;
