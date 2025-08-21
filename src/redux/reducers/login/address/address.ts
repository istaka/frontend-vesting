import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletAddress: "",
  walletType: "",
  chainId: "",
  trimWalletAddress: "",
  connected: false,
  ownerArray: [],
  owner: "",
  ownerBalances: "",
  tokenDecimal: "",
  connector: "",
  selectedVestingAddress: "",
  selectedOptions: "",
  pazzaBal: 0,
  usdtBal: 0,
};

export const addressSlice: any = createSlice({
  name: "address",
  initialState,
  reducers: {
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setWalletType: (state, action) => {
      state.walletType = action.payload;
    },
    setChainid: (state: any, action: any) => {
      state.chainId = action.payload;
    },
    setTrimWalletAddress: (state: any, action: any) => {
      state.trimWalletAddress = action.payload;
    },
    setConnected: (state: any, action: any) => {
      state.connected = action.payload;
    },
    setOwnerArray: (state: any, action: any) => {
      state.ownerArray = action.payload;
    },
    setOwner: (state: any, action: any) => {
      state.owner = action.payload;
    },
    setOwnerBalances: (state: any, action: any) => {
      state.ownerBalances = action.payload;
    },
    setTokenDecimal: (state: any, action: any) => {
      state.tokenDecimal = action.payload;
    },
    setConnector: (state, action) => {
      state.connector = action.payload;
    },
    setSelectedVestingAddress: (state, action) => {
      state.selectedVestingAddress = action.payload;
    },
    setSelectedOptions: (state, action) => {
      state.selectedOptions = action.payload;
    },
    pazazUserBalAction: (state: any, action: any) => {
      state.pazzaBal = action.payload;
    },
    usdtUserBalAction: (state: any, action: any) => {
      state.usdtBal = action.payload;
    },

    removeAddress: (state) => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setWalletAddress,
  setWalletType,
  setChainid,
  setTrimWalletAddress,
  setConnected,
  setOwnerArray,
  setOwner,
  setOwnerBalances,
  setTokenDecimal,
  setConnector,
  setCookies,
  setSelectedVestingAddress,
  setSelectedOptions,
  removeAddress,
  pazazUserBalAction,
  usdtUserBalAction,
} = addressSlice.actions;

export default addressSlice.reducer;
