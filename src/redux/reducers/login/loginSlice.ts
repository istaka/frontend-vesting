import { createSlice } from "@reduxjs/toolkit";

const  initialState:any =  {
  accessToken: "",
  email: "",
  userId: "",
  authStatus: false,
  userAccessibleRoles: "",
  role: "",
  walletAddress: "",
 
}

export const loginSlice: any = createSlice({
  name: "login",
  initialState,
  reducers: {
    tokenAction: (state: any, action: any) => {
      state.accessToken = action.payload;
      state.email = action.payload.email || "";
      state.userId = action.payload.userId || "";
      state.authStatus = action.payload.authStatus || false;
      state.userAccessibleRoles = action.payload.userAccessibleRoles || "";
      state.role = action.payload.role || "";
      state.walletAddress = action.payload.walletAddress || "";
      
    },
    pazazUserBalAction: (state: any, action: any) => {
      state.pazzaBal = action.payload;
    },
    resetLoginSlice: () => initialState,
    usdtUserBalAction: (state: any, action: any) => {
      state.usdtBal = action.payload;
    },
  },
});

export const { tokenAction,
  pazazUserBalAction,
  resetLoginSlice,
  usdtUserBalAction
 } = loginSlice.actions;
export default loginSlice.reducer;
