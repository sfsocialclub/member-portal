import { combineReducers } from "@reduxjs/toolkit";
import { optimisticPathReducer } from "./features/navigation/optimisticPathSlice";
import { roleAPI } from "./services/role";

const rootReducer = combineReducers({
  optimisticPath: optimisticPathReducer,
  [roleAPI.reducerPath]: roleAPI.reducer,
});

export default rootReducer;
