import Web3 from "web3";
import tokenAbi from "../../Assets/abi/tokenAbi.json";
import vestingAbi from "../../Assets/abi/vestingAbi.json";
import proxyTokenAbi from "../../Assets/abi/ProxyTokenAbi.json";
import multiVestingAbi from "../../Assets/abi/multiVestingAbi.json";
import store from "../../redux/store";
import {
  MULTI_VESTING_CONTRACT,
  BONDING_TOKEN,
  TOKEN,
  VESTING_CONTRACT,
} from "../../Components/common/Toasts/ConstVar";
import { toast } from "../../Components/common/Toasts/Toast";
import { walletProvider } from "../wallet/provider";

let web3Instance: any, vesting_contract_instance: any;

export const callWeb3 = async (wallettype: any) => {
  try {

    const { web3 } = window;
    const connector = store.getState()?.address?.connector;

    if (wallettype == "Metamask") {
      const provider = await walletProvider("Metamask");

      if (provider) {
        web3Instance = new Web3(provider);
        return web3Instance;
      } else if (web3) {
        web3Instance = new Web3(web3.currentProvider);
        return web3Instance;
      }
    } else {
      if (wallettype == "Wallet Connect") {
        const wcV3Provider = await connector?.getProvider();
        web3Instance = new Web3(wcV3Provider);
        return web3Instance;
      }
    }
  } catch (error) {
    console.log("callWeb3_error", error);
    return false;
  }
};

export const createInstance = async (dynamicAddress: string, abi: any) => {
  try {
    const wallettype = store.getState()?.address?.walletType;

    let web3: any = await callWeb3(wallettype);
    /**CREATE CONTRACT INSTANCE WITH ABI */
    if (web3 != false) {
      vesting_contract_instance = await new web3.eth.Contract(
        abi,
        dynamicAddress
      );

      return vesting_contract_instance;
    }
  } catch (error) {
    console.log("createInstance_error", error);
  }
};

/**SEND CONTRACT TYPE AND DYAMIC ADDRESS(OPTIONAL) FOR GET CONTRACT INSTANCE*/
const getContractInstance = async (
  contractType: string,
  dynamicAddress: string
) => {
  let finalVestingAbi = JSON.parse(JSON.stringify(vestingAbi));
  let finalTokenAbi = JSON.parse(JSON.stringify(tokenAbi));

  switch (contractType) {
    case VESTING_CONTRACT:
      return await createInstance(dynamicAddress, finalVestingAbi);
    case MULTI_VESTING_CONTRACT:
      return await createInstance(dynamicAddress, multiVestingAbi);
    case TOKEN:
      return await createInstance(dynamicAddress, finalTokenAbi);
    case BONDING_TOKEN:
      return await createInstance(dynamicAddress, proxyTokenAbi);
    default:
      return null;
  }
};

/**CALL CONTRACT GET METHODS. ALL PARAMS WILL BE DYNAMIC */
let error = true;
// export const callGetMethod = async (
//   method: string,
//   data: any,
//   contractType: string,
//   dynamicAddress: string
// ) => {
//   try {
//     let contract: any = await getContractInstance(contractType, dynamicAddress);

//     if (contract) {
//       let result: any = await contract?.methods[method]
//         ?.apply(null, Array.prototype.slice.call(data))
//         .call();

//       if (result >= 0) {
//         return result;
//       }
//     }
//   } catch (error) {
//     toast.error(error.message);
//     // Toast.error(error.message);
//     console.log("callGetMethod_error", error);
//   }
// };
export const callGetMethod = async (
  method: string,
  data: any,
  contractType: string,
  dynamicAddress: string
) => {
  try {
    let contract: any = await getContractInstance(contractType, dynamicAddress);

    if (contract) {
      let result: any = await contract?.methods[method]
        ?.apply(null, Array.prototype.slice.call(data))
        .call();

      if (result >= 0) {
        return result;
      }
    }
  } catch (error) {
    console.error("🚨 callGetMethod Error 🚨");
    console.error("Contract Type:", contractType);
    console.error("Contract Address:", dynamicAddress);
    console.error("Method:", method);
    console.error("Params:", data);
    console.error("Error Message:", error?.message);

    toast.error(`Error in ${contractType} at ${dynamicAddress}: ${error?.message}`);
  }
};


/**CALL CONTRACT SEND METHODS. ALL PARAMS WILL BE DYNAMIC */
export const callSendMethod = async (
  method: string,
  data: any,
  walletAddress: string,
  contractType: string,
  value: any,
  dynamicAddress: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      /**CHECK WALLET IS CONNECTED */
      if (walletAddress === "") {
        reject(new Error("Please connect wallet"));
      }
      /**CREATE DATA FOR CALL SEND METHOD */
      let dataForSend: any = { from: walletAddress };

      /**CHECK IF WE NEED TO SEND VALUE IN SEND METHOD */
      if (value) {
        dataForSend.value = value;
      }

      /**GET SELECTED CONTRACT INSTANCE */
      let contract: any = await getContractInstance(
        contractType,
        dynamicAddress
      );

      if (contract?.methods) {
        let data1: any = [data.walletAddress, data?.address, data?.tokenId];

        /**CALL SEND METHOD */

        await contract.methods?.[method]
          .apply(null, Array.prototype.slice.call(data))
          .send(dataForSend)
          .then((result: object) => {
            resolve(result);
          })
          .catch((error: Error) => {
            console.log("calllllllllllllll", error);

            reject(error);
          });
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const hexToNumber = (data: any) => {
  const tokenId = web3Instance.utils.hexToNumberString(data);
  return tokenId;
};
