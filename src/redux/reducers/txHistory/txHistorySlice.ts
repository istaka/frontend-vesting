import { createSlice } from "@reduxjs/toolkit";

export const txHistorySlice = createSlice({
  name: "txHistory",
  initialState: {
    txHistoryDetail: {},
  },
  reducers: {
    txHistoryAction: (state: any, action: any) => {
      state.txHistoryDetail = action.payload;
    },
  },
});

export default txHistorySlice.reducer;
export const { txHistoryAction } = txHistorySlice.actions;
