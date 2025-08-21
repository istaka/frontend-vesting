import Web3 from "web3";
import { toast } from "../../common/Toasts/Toast";
import wc_icon from "../../../Assets/Icon/walletconnect.svg";
import metamark_icon from "../../../Assets/Icon/metamask.svg";
import { setloader } from "../../../redux/reducers/Loader/loaderslice";
import { callGetMethod } from "../../../service/contractServices/contract.service";
import { UserList } from "../../../service/apiModels/userApiService/Post/userApiService";
import {
  Paza_Address,
  PreferredContract,
  BONDING_CURVE_ADDRESS,
  runningchain,
} from "../../../Constant";
import {
  removeAddress,
  setOwner,
  setOwnerArray,
  setOwnerBalances,
  setSelectedOptions,
  setWalletAddress,
} from "../../../redux/reducers/login/address/address";
import {
  Metamask,
  BONDING_TOKEN,
  TOAST_MESSAGE,
  Wallet_Connect,
} from "../../common/Toasts/ConstVar";

export const walletList = [
  {
    id: 1,
    name: Metamask,
    icon: metamark_icon,
  },
  // {
  //   id: 2,
  //   name: Wallet_Connect,
  //   icon: wc_icon,
  // },
];

export const getDecimal = async () => {
  let decimal: any = await callGetMethod("decimals", [], "TOKEN", Paza_Address);
  return decimal?.toString();
};

export const toWeiConvert = async (amount: any) => {
  return await Web3.utils.toWei(amount, "ether");
};

export const amountValueFormate = (amount: any, decimal: any) => {
  if (amount > 0) {
    return Number((amount / 10 ** decimal).toFixed(decimal));
  }
  return 0;
};

export const checkBalanceCall = async (
  data: any,
  response: any,
  funName: string,
  decimal: any
) => {
  try {
    // console.log("response", response, funName, data);

    let balance1: any;
    if (response.type == "single") {
      balance1 = await callGetMethod(
        funName,
        data,
        "VESTING_CONTRACT",
        response?.contractAddress
      );
      console.log("balance1", balance1);

      let numBalance = Number(balance1);

      if (balance1 > 0) {
        let converted_Balance: any = (numBalance / 10 ** decimal).toFixed(2);
        return converted_Balance || 0;
      } else if (numBalance == 0) {
        return 0;
      }
    } else if (response.type == "multi") {
      balance1 = await callGetMethod(
        funName,
        data,
        "MULTI_VESTING_CONTRACT",
        response?.contractAddress
      );
      let numBalance = Number(balance1);

      if (numBalance > 0) {
        let converted_Balance: any = (numBalance / 10 ** decimal).toFixed(2);
        return (await converted_Balance) || 0;
      } else if (numBalance == 0) {
        return 0;
      }
    }
  } catch (error) {
    console.log("checkBalanceCall_CHECK_BALANCE_ERROR------>", error);
  }
};

export const checkBalances = async (
  data: any,
  response: any,
  decimal: any,
  dispatch: any
) => {
  if (response) {
    let bal3: any;

    let bal1: any = await checkBalanceCall(
      data,
      response,
      "claimmableAmount",
      decimal
    );
    // console.log("bal1", bal1);

    let bal2 = await checkBalanceCall(data, response, "claimed", decimal);

    let proxyBal = await callGetMethod(
      "buyCalculateUsdcAgainstToken",
      ["1000000000000000000"],
      BONDING_TOKEN,
      BONDING_CURVE_ADDRESS
    );
    
    let proxyBalDecimal = (Number(proxyBal) / 10 ** 6)?.toFixed(4);
    // console.log("proxyBal", proxyBalDecimal);

    if (bal1 >= 0 && bal2 >= 0) {
      if (response.type == "single") {
        bal3 = await checkBalanceCall([], response, "totalAllocation", decimal);
      } else {
        let data1 = [data[1]];

        bal3 = await checkBalanceCall(
          data1,
          response,
          "userAllocation",
          decimal
        );
      }
    }

    if (bal1 >= 0 && bal2 >= 0 && bal3 >= 0) {
      let obj: any = {
        balance_Vested: bal1,
        claimed: bal2,
        total_Allocation: bal3,
        proxyBal: proxyBalDecimal,
      };
      // console.log("xxxxxxxxxxxxxxxx", obj);

      dispatch(setOwnerBalances(obj));
    }
  }
};

export const walletConnectFunc = async (
  account: any,
  dispatch: any,
  handleWalletConnectDisconnect: any,
  connector: any
) => {
  try {
    dispatch(setloader(true));
    let res = await checkVestingList(account, dispatch);
    if (!res) {
      toast.error(TOAST_MESSAGE.validAddress);
      handleWalletConnectDisconnect();
      dispatch(removeAddress());
    }
  } catch (error) {
    console.log("error_in_walletconnect_function", error);
  }
};

export const checkVestingList = async (account: any, dispatch: any) => {
  try {
    if (account) {
      let combineData = [];
      let onChainData: any;
      onChainData = "";
      onChainData = await checkOwner(dispatch, account);
      let data: any;
      if (onChainData) {
        data = {
          userAddress: onChainData?.beneficiary || account,
        };

        combineData.push(onChainData);
      } else {
        data = {
          userAddress: account,
        };
      }

      const apiData: any = await UserList(data);

      if (combineData?.length > 0) {
        const filterData: any = apiData?.data?.filter(
          (item: any, i: any) =>
            item.toLowerCase() !== combineData[0].contractAddress.toLowerCase()
        );
        await filterData?.map((item: any) => {
          let multiData: any = {
            type: "multi",
            beneficiary: account,
            contractAddress: item,
          };

          combineData.push(multiData);
          return multiData;
        });
      } else {
        await apiData?.data?.map((item: any) => {
          let multiData: any = {
            type: "multi",
            beneficiary: account,
            contractAddress: item,
          };

          combineData.push(multiData);
          return multiData;
        });
      }

      dispatch(setSelectedOptions(combineData));

      if (combineData && combineData?.length > 0) {
        let res: any = combineData?.filter(
          (item: any) =>
            item?.beneficiary.toLowerCase() == account?.toLowerCase()
        );

        if (res?.length > 0) {
          dispatch(setWalletAddress(res[0]?.beneficiary));
          toast.success(TOAST_MESSAGE.connected);
          dispatch(setloader(false));
          return res[0];
        }
      } else {
        return false;
      }
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const checkOwner = async (dispatch: any, account: string) => {
  try {
    let contract: any = PreferredContract;
    let len: any = contract.length;
    const ownerArray: any = [];
    for (let i = 0; i < len; i++) {
      let address: any;
      address = await callGetMethod(
        "beneficiary",
        [],
        `VESTING_CONTRACT`,
        contract[i]
      );

      ownerArray.push({
        contractAddress: contract[i],
        beneficiary: address,
        type: "single",
      });
    }
    dispatch(setOwnerArray(ownerArray));

    if (ownerArray?.length) {
      let res: any = ownerArray?.find(
        (data: any) =>
          data?.beneficiary?.toLowerCase() == account?.toLowerCase()
      );
      if (res) {
        dispatch(setOwner(res));
        return res;
      } else {
        return "";
      }
    }
  } catch (error) {
    dispatch(setloader(false));
    // toast.error(JSON.stringify(error));
    console.log("checkOwner_CALL_METHOD_ERROR------------>", error);
    // return false;
  }
};
