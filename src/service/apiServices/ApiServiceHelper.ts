/** @format */

import { toast } from "../../Components/common/Toasts/Toast";
import { setContractStatus } from "../../redux/reducers/borrowers/borrowersSlice";
import {
  pazazUserBalAction,
  resetLoginSlice,
  usdtUserBalAction,
} from "../../redux/reducers/login/loginSlice";
import  store  from "../../redux/store";
import web3Service from "../contractServices/web3.service";
import jwt from "jsonwebtoken";
let counter = true;

/**
 * function to handle if the token is expired and making the user logout if jwt is expired
 * @param error error when an API fails
 */
export const TokenExpiryFunction = (error: any) => {
  let res = localStorage.getItem("access-token");
  if (error?.response?.status == "401" && res && counter) {
    toast.error("Session Expired");
    const decoded:any = jwt.decode(res);
    counter = false;
    store?.dispatch(resetLoginSlice());
    store?.dispatch(setContractStatus(false as any));  
    localStorage.clear();
    if(decoded?.persona=="RetailBondInvestor" || decoded?.persona=="InstitutionalBondInvestor")
    {
      setTimeout(() => {
        window.location.replace("/marketplace/signin");
      }, 1000);
    }
    else
    {
      setTimeout(() => {
        window.location.replace("/login");
      }, 1000);
    }  
  }
};

/**
 *
 * @param dispatch dispatch function for redux
 * @param setterForPrice optional parameter for setting the PAZA price into react state
 */
export const fetchTokenBalances = async (
  dispatch: any,
  setterForPrice?: any
) => {
       
  
  const storeRes: any = store.getState();
  if (storeRes?.walletSlice?.verifiedDetail) {
    const usdtUserBal: any = parseFloat(
      (await web3Service?.userBalanceUsdt(
        storeRes?.walletSlice?.walletDetails?.address
      )) as string
    );
    // if (typeof usdtUserBal == "number" || usdtUserBal instanceof Number)
    dispatch(usdtUserBalAction(usdtUserBal));
    let pazabalance;
    const pazzaUserBal: any = parseFloat(
      (await web3Service?.userBalancePazza(
        storeRes?.walletSlice?.walletDetails?.address
      )) as string
    );
    const pazaDec: any = await web3Service?.getDecimalsPaza();
    dispatch(pazazUserBalAction(pazzaUserBal));
    // const getPazaPrice: any = await web3Service?.getPazaTokenPrice();
              const getPazaPrice: any = await web3Service.getBuyUsdcPrice("1000000");
    
    // const orgPazaPrice = getPazaPrice / 10 ** pazaDec;
    if (setterForPrice != null) setterForPrice(getPazaPrice);
  }
};

/**
 * common function to capitalize a string
 * @param inputString string to convert
 * @returns capitalized string
 */

export function capitalizeFirstLetter(inputString: any) {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

/**
 *function to search for a =n item through an array
 * @param searchlist array of list for searching
 * @param getfilters value to be searched
 * @returns search item
 */
//NOT USING
export const searchFilter = (searchlist: any, getfilters: any) => {
  var result: any = [];
  for (const [key, value] of Object.entries(getfilters)) {
    switch (key) {
      case "searchVault":
        if (value === "") {
          result = searchlist;
        } else {
          result = searchlist.filter((item: any) => {
            return item.altSymbol?.includes(getfilters.searchVault) && item;
          });
        }
        break;
      case "ftype":
        if (value !== "All") {
          result = result.filter((item: any) => {
            if (value === "Single Asset" && item.isLpToken === false) {
              return item;
            } else if (value === "Liquidity Asset" && item.isLpToken === true) {
              return item;
            }
          });
        } else {
          return result;
        }
        break;
    }
  }

  return result;
};
