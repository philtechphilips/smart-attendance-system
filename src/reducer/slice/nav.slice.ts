import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavState {
  open: boolean;
}

const initialState: NavState = {
  open: false, // Initial state
};

const navSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    toggleOpen: (state) => {
      state.open = !state.open;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload; // Set open explicitly
    },
  },
});

export const { toggleOpen, setOpen } = navSlice.actions;
export default navSlice.reducer;
