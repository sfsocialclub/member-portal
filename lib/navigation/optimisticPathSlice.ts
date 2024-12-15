import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  path: "",
};

const optimisticPathSlice = createSlice({
  name: "path",
  initialState,
  reducers: {
    setOptimisticPath(state, action) {
      state.path = action.payload;
    },
    clearOptimisticPath(state) {
      state.path = "";
    },
  },
});

export const { setOptimisticPath, clearOptimisticPath } =
  optimisticPathSlice.actions;
export const optimisticPathReducer = optimisticPathSlice.reducer;
