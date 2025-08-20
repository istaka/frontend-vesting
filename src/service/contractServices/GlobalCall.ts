import Web3 from "web3";
import { toast } from "../../Components/common/Toasts/Toast";
import {
  Metamask,
  Wallet_Connect,
} from "../../Components/common/Toasts/ConstVar";
import { metamaskProvider, wcprovider } from "../wallet/provider";

export const toWeiConvert = async (amount: any) => {
  return await Web3.utils.toWei(amount, "ether");
};

export const fromWeiConvert = async (amount: any) => {
  return await Web3.utils.fromWei(amount, "ether");
};


