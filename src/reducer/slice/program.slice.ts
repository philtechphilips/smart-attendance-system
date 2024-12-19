import { createSlice } from "@reduxjs/toolkit";
import { getAllPrograms } from "../actions/program.dispatcher";
import { PURGE } from "../store";
import { toast } from "react-toastify";

interface allProgramsState {
  allPrograms: any;
}

const initialState: allProgramsState = {
  allPrograms: [],
};

const allProgramsSlice = createSlice({
  name: "Schools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allPrograms = initialState.allPrograms;
      })
      .addCase(getAllPrograms.fulfilled, (state, action) => {
        state.allPrograms = action.payload;
      })
      .addCase(getAllPrograms.rejected, (state) => {
        toast.error("Unable to get programs!");
      });
  },
});

export default allProgramsSlice.reducer;
