import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice: any = createSlice({
  name: "loader",
  initialState: {
    loader: false,
  },
  reducers: {
    setloader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

export const { setloader } = loaderSlice.actions;
export default loaderSlice.reducer;
