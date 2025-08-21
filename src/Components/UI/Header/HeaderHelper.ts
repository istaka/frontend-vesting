import { Paza_Address } from "../../../Constant";
import { setloader } from "../../../redux/reducers/Loader/loaderslice";
import {
  setSelectedVestingAddress,
  setTokenDecimal,
} from "../../../redux/reducers/login/address/address";
import { walletProvider } from "../../../service/wallet/provider";
import { toast } from "../../common/Toasts/Toast";
import {
  checkBalances,
  getDecimal,
} from "../ConnectWallet/connectWalletHelper";

export const handleSelect = async (
  data: any,
  dispatch: any,
  wallet_Address: any,
  setselectedOption: any
) => {
  let selectedData = {
    type: data?.type,
    contractAddress: data.value,
  };
  dispatch(setSelectedVestingAddress(selectedData));
  setselectedOption(data);
  if (selectedData) {
    let data = [Paza_Address];
    let decimal: any = await getDecimal();
    console.log("decimal", decimal);

    dispatch(setTokenDecimal(decimal));
    if (selectedData.type == "single") {
      checkBalances(data, selectedData, decimal, dispatch);
    } else if (selectedData.type == "multi") {
      let data = [Paza_Address, wallet_Address];
      checkBalances(data, selectedData, decimal, dispatch);
    }
  }
};
export const handleSell = async (
  data: any,
  dispatch: any,
  wallet_Address: any,
  setselectedOption: any
) => {
  let selectedData = {
    type: data?.type,
    contractAddress: data.value,
  };
  dispatch(setSelectedVestingAddress(selectedData));
  setselectedOption(data);
  if (selectedData) {
    let data = [Paza_Address];
    let decimal: any = await getDecimal();
    console.log("decimal", decimal, selectedData);

    dispatch(setTokenDecimal(decimal));
    if (selectedData.type == "single") {
      checkBalances(data, selectedData, decimal, dispatch);
    } else if (selectedData.type == "multi") {
      let data = [Paza_Address, wallet_Address];
      checkBalances(data, selectedData, decimal, dispatch);
    }
  }
};

export const handleAdd = async (dispatch: any, wallet_Type: any) => {
  const tokenAddress: string = Paza_Address;
  const tokenSymbol: string = "PAZA";
  const tokenDecimals: number = 18;
  const tokenImage: string = "http://placekitten.com/200/300";

  try {
    dispatch(setloader(true));
    const provider: any = await walletProvider(wallet_Type);
    const wasAdded: any = await provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });
    console.log("wasAdded", wasAdded);

    if (wasAdded) {
      dispatch(setloader(false));
    }
  } catch (error) {
    dispatch(setloader(false));
    toast.error(error.message);
  }
};
