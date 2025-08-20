import { createSlice } from "@reduxjs/toolkit";

export const borrowersSlice = createSlice({
  name: "borrowers",
  initialState: {
    borrowersDetail: {},
    contractResponse: false,
    nftData: [],
    selectAll: false,
  },
  reducers: {
    borrowersAction: (state: any, action: any) => {
      state.borrowersDetail = action.payload;
    },
    setContractStatus: (state: any, action: any) => {
      state.contractResponse = action.payload;
    },
    setNftDataList: (state: any, action: any) => {
      state.nftData = action.payload;
    },
    setSelectAll: (state: any, action: any) => {
      state.selectAll = action.payload;
    },
  },
});

export default borrowersSlice.reducer;
export const {
  borrowersAction,
  setContractStatus,
  setNftDataList,
  setSelectAll,
} = borrowersSlice.actions;
