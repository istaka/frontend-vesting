import { APIURL } from "../../../../Constant";
import { apiCallGet, apiCallPost } from "../../../apiServices/ApiServices";

export const UserList = async (data: any) => {
  try {
    const result: any = await apiCallPost(
      APIURL.ALL_USER_TRANSACTION_LIST,
      data,
      {}
    );

    if (result) {
      return result?.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};

export const TransactionList = async (data: any) => {
  try {
    const result: any = await apiCallPost(APIURL.TRANSACTION_HISTORY, data, {});
    if (result) {
      // dispatch(tokenAction(result?.data.data.token));

      return result?.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};
export const sellCap = async (userAddress: string) => {
  try {
    // const url = `user-sell-cap`;
    const params = { userAddress };

    const result = await apiCallGet(APIURL.SELL_CAP, params, "");

    return result || [];
  } catch (error: any) {
    console.error("Error fetching sell cap:", error?.message);
    return [];
  }
};

export const SellPaza_TransactionList = async (data: any) => {
  try {
    const result: any = await apiCallPost(APIURL.SELL_TRANSACTION_HISTORY, data, {});
    if (result) {
      // dispatch(tokenAction(result?.data.data.token));

      return result?.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};

export const ALL_TransactionList = async (data: any) => {
  try {

    const result: any = await apiCallPost(APIURL.ALLTRANSACTION_LIST, data, {});
    if (result) {
      // dispatch(tokenAction(result?.data.data.token));

      return result?.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};
