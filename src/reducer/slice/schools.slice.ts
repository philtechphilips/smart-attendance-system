import { createSlice } from "@reduxjs/toolkit";
import { getAllSchools } from "../actions/school.dispatcher";
import { PURGE } from "../store";

interface allSchoolsState {
  allSchools: any;
}

const initialState: allSchoolsState = {
  allSchools: [],
};

const allSchoolsSlice = createSlice({
  name: "Schools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allSchools = initialState.allSchools;
      })
      .addCase(getAllSchools.fulfilled, (state, action) => {
        state.allSchools = action.payload;
      })
      .addCase(getAllSchools.rejected, (state) => {
        console.log("Unable to get Schools");
        // toast.error('Unable to get Alerts')
      });
  },
});

export default allSchoolsSlice.reducer;
