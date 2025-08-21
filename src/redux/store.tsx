import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import addressReducer from "../redux/reducers/login/address/address";

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";
import loginSlice from "./reducers/login/loginSlice";
import loaderSlice from "./reducers/Loader/loaderslice";
import type { Reducer } from "@reduxjs/toolkit";
import *as Flatted from "flatted";
import { createTransform } from "redux-persist";

// const transformCircular = createTransform(
//   (inboundState, key) => Flatted.stringify(inboundState),
//   (outboundState, key) => Flatted.parse(outboundState)
// );

const rootReducer: Reducer<{
  loginSlice: any;
  address: any;
  loaderSlice: any;
}> = combineReducers({
  loginSlice: loginSlice,
  address: addressReducer,
  loaderSlice: loaderSlice,
});

const persistConfig = {
  key: "root",
  storage,
  // transforms: [transformCircular],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
