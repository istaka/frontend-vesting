import Web3 from "web3";
import { CHAIN_CURRENCY_DECIMAL, CHAIN_CURRENCY_SYMBOL, CHAIN_EXPLORER, CHAIN_RPC, CHAIN_WALLET_NAME } from "./chain";

export const switchNetwork = async (chainId: number, provider: any) => {
  try {
    // console.log('chainId', chainId)

    let res: any = await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: Web3.utils.toHex(chainId) }],
    });
    if (res == null) {
      return true;
    }
  } catch (switchError: any) {
    if (switchError.code == 4001) {
      return switchError.message;
    }
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code == 4902 || switchError.code == -32603) {
      try {
        let res: any;
        res = await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: Web3.utils.toHex(chainId),
              rpcUrls: [CHAIN_RPC[chainId]],
              chainName: CHAIN_WALLET_NAME[chainId],
              nativeCurrency: {
                name: CHAIN_WALLET_NAME[chainId],
                symbol: CHAIN_CURRENCY_SYMBOL[chainId],
                decimals: CHAIN_CURRENCY_DECIMAL[chainId],
              },
              blockExplorerUrls: [CHAIN_EXPLORER[chainId]],
            },
          ],
        });
        if (res == null) {
          return true;
        }
      } catch (addError: any) {
        return addError.message;
      }
    }
  }
};

export const getChainid = async (provider: any) => {
  const web3 = new Web3(provider);
  let networkChainId: any = await web3.eth.getChainId();

  return networkChainId;
};