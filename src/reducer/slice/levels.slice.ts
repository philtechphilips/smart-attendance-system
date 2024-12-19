import { createSlice } from "@reduxjs/toolkit";
import { getAllLevels } from "../actions/level.dispatcher";
import { PURGE } from "../store";
import { toast } from "react-toastify";

interface allLevelsState {
  allLevels: any;
}

const initialState: allLevelsState = {
  allLevels: [],
};

const allLevelsSlice = createSlice({
  name: "Schools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allLevels = initialState.allLevels;
      })
      .addCase(getAllLevels.fulfilled, (state, action) => {
        state.allLevels = action.payload;
      })
      .addCase(getAllLevels.rejected, (state) => {
        toast.error("Unable to get Levels!");
      });
  },
});

export default allLevelsSlice.reducer;
