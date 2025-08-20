import Web3 from "web3";

import { switchNetwork } from "./switchNetwork";
import { setloader } from "../../redux/reducers/Loader/loaderslice";
import { toast } from "../../Components/common/Toasts/Toast";

const walletServices = {
  metaMaskConnect: async ({
    availableChains,
    dispatch,
    provider,
  }: {
    availableChains: number[];
    dispatch: any;
    provider: any;
  }) => {

    if (provider) {
      try {
        dispatch(setloader(true));
        const web3 = new Web3(provider);
        let chainId: any = await web3?.eth?.getChainId();
        chainId = chainId?.toString();

        if (!availableChains?.includes(chainId)) {
          //  toast.error("Please Switch to Polygon Matic");
          let res: any = await switchNetwork(availableChains[0], provider);

          if (res != true) {
            dispatch(setloader(false));
            toast.error(res);
            return;
          } else if (res == true) {
            const [account] = await provider?.request({
              method: "eth_requestAccounts",
            });

            // console.log("account", account);
            return account;
            // return await checkVestingList(account, dispatch, chainId);
          }
        }
      } catch (err: any) {
        console.log("connection error", err);

        dispatch(setloader(false));
        if (err?.code == 4001) {
          toast.error(err?.message);
        }
        return false;
      }
    }
  },
};

export default walletServices;
