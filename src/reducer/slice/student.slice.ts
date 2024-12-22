import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "../store";
import { toast } from "react-toastify";
import { getStudentsByDepartment } from "../actions/students.dispatcher";

interface allStudentsState {
  allStudents: {
    items: any[];
    pagination: {
      total: number;
      currentPage: number;
    };
  };
}

const initialState: allStudentsState = {
  allStudents: {
    items: [],
    pagination: {
      total: 0,
      currentPage: 0,
    },
  },
};

const allStudentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allStudents = initialState.allStudents;
      })
      .addCase(getStudentsByDepartment.fulfilled, (state, action) => {
        const newItems = action.payload.items.filter(
          (newItem: any) =>
            !state.allStudents.items.some(
              (existingItem) => existingItem.id === newItem.id,
            ),
        );
        state.allStudents.items = [...state.allStudents.items, ...newItems];
        state.allStudents.pagination = action.payload.pagination;
      })
      .addCase(getStudentsByDepartment.rejected, (state) => {
        toast.error("Unable to get students!");
      });
  },
});

export default allStudentsSlice.reducer;
