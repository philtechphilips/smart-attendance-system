import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "../store";
import { toast } from "react-toastify";
import { getStaffsByDepartment } from "../actions/lecturer.dispatcher";

interface allStaffsState {
  allStaffs: {
    items: any[];
    pagination: {
      total: number;
      currentPage: number;
    };
  };
}

const initialState: allStaffsState = {
  allStaffs: {
    items: [],
    pagination: {
      total: 0,
      currentPage: 0,
    },
  },
};

const allStaffsSlice = createSlice({
  name: "staffs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allStaffs = initialState.allStaffs;
      })
      .addCase(getStaffsByDepartment.fulfilled, (state, action) => {
        const newItems = action.payload.items.filter(
          (newItem: any) =>
            !state.allStaffs.items.some(
              (existingItem) => existingItem.id === newItem.id,
            ),
        );
        state.allStaffs.items = [...state.allStaffs.items, ...newItems];
        state.allStaffs.pagination = action.payload.pagination;
      })
      .addCase(getStaffsByDepartment.rejected, (state) => {
        toast.error("Unable to get staffs!");
      });
  },
});

export default allStaffsSlice.reducer;
