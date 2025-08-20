import "./ConnectWallet.scss";
import store from "../../../redux/store";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "../../common/Toasts/Toast";
import { trimAddress } from "../../../CommonHelper";
import { useNetwork, useSwitchNetwork } from "wagmi";
import walletServices from "../../../service/wallet";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../CustomButton/CustomButton";
import { walletProvider } from "../../../service/wallet/provider";
import { getChainid } from "../../../service/wallet/switchNetwork";
import { CloseIcon, RightArrowIcon } from "../../../Assets/Icon/svg/SvgIcons";
import { chainIds, DAPP_URL_METAMASK, runningchain } from "../../../Constant";
import { setloader } from "../../../redux/reducers/Loader/loaderslice";

import {
  walletList,
  checkVestingList,
  walletConnectFunc,
} from "./connectWalletHelper";
import {
  Metamask,
  alertMessage,
  TOAST_MESSAGE,
} from "../../common/Toasts/ConstVar";
import {
  setChainid,
  setConnector,
  setConnected,
  setWalletType,
  removeAddress,
} from "../../../redux/reducers/login/address/address";
import { resetRedux } from "../../../ClearRedux";

const ConnectWallet = (props: any) => {
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { error, switchNetwork } = useSwitchNetwork();
  const { address, connector, isConnected } = useAccount();
  const storeData = useSelector((state) => state); 

  const [active, setActive] = useState<boolean>(false);

  const addressSlice = useSelector((state: any) => state?.address);

  const handleClick = () => {
    setActive(!active);
  };
  const handleAccountsChanged = async (accounts: any) => {
    try {
      let walletAddress = store?.getState()?.address?.walletAddress;
      dispatch(setWalletType(Metamask));

      if (accounts == "" && walletAddress) {
        handleDisConnect(Metamask);
        return;
      } else if (accounts[0] && walletAddress) {
        let temp = 1;
        let res: any = await checkVestingList(accounts[0], dispatch);
        if (!res) {
          toast.success(TOAST_MESSAGE.disconnect);
          dispatch(removeAddress());
        }
        temp = temp + 1;
        // setCount(temp);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChainChanged = (networkId: any) => {
    let walletAddress = store.getState()?.address?.walletAddress;
    const res: any = chainIds?.filter((item: any) => item == networkId);

    if (res == "" && walletAddress) {
      handleDisConnect(Metamask);
    }
  };

  const callnetworks = async () => {
    let Window: any = window;
    if (Window.ethereum) {
      const provider = await walletProvider("Metamask");
      provider?.on("accountsChanged", handleAccountsChanged);
      provider?.on("networkChanged", handleChainChanged);
      return () => {
        if (provider?.removeListener) {
          provider?.removeListener("accountsChanged", handleAccountsChanged);
          provider?.removeListener("networkChanged", handleChainChanged);
        }
      };
    }
  };

  const handleConnect = async (walletType: string) => {
    try {
      dispatch(setWalletType(walletType));
     
      let availableChains = [runningchain.chainId];
      let response: any;

      if (walletType == Metamask) {
        const provider = await walletProvider(Metamask);
        if (isMobile) {
          if (provider) {
            response = await walletServices.metaMaskConnect({
              availableChains,
              dispatch,
              provider,
            });
          } else {
            //redirect to mobile metamask browser
            alert(alertMessage);
            const dappUrl = DAPP_URL_METAMASK;
            let metamaskAppDeepLink =
              "https://metamask.app.link/dapp/" + dappUrl;
            window?.open(metamaskAppDeepLink);
          }
        } else {
          response = await walletServices.metaMaskConnect({
            availableChains,
            dispatch,
            provider,
          });
          // console.log("metamask_connect_respons", response);
        }
        if (response) {
          let res: any = await checkVestingList(response, dispatch);
          if (!res) {
            toast.error(TOAST_MESSAGE.validAddress);
          }
          setActive(!active);
          const chainid = await getChainid(provider);
          dispatch(setChainid(chainid?.toString()));
        }
      } else {
        await open();
        setActive(!active);
      }
    } catch (err) {
      toast.error(JSON.stringify(err));
    }
  };

  const handleDisConnect = (walletType: string) => {
    try {
      // Clear localStorage

      dispatch(setloader(true));

      localStorage.clear();
      
      // Show disconnect toast
      
      // Close wallet modal
      setActive(!active);
      
      // Handle WalletConnect specific disconnect
      if (walletType == "Wallet Connect") {
        disconnect();
      }
      
      // Clear all Redux states
      dispatch(removeAddress());
      resetRedux();
      setTimeout(() => {
        dispatch(setloader(false));
        
        toast.success(TOAST_MESSAGE.disconnect);
      }, 1000);
      
      
      // Reset local state if needed
      // setInput1Err(false);
      // setAmountMaxErr(false);
      // setPazaBalExceed(false);
      // setPoolBalanceEXceed(false);
      
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Error disconnecting wallet");
    }
  };

  const handleWalletConnectDisconnect = () => {
    // alert("hello");
    disconnect();
    dispatch(setConnected(false));
    resetRedux();
    // handleDisConnect("Wallet Connect");
  };

  const walletConnectCall = async () => {
  let provider = await connector?.getProvider();
  // console.log('provider', provider);

  if (provider?.on) {
    provider.on("session_update", async (updatedSession: any) => {
      console.log("WalletConnect session updated:", updatedSession);
    });

    provider.on("session_delete", () => {
      console.log("WalletConnect session deleted");
      handleDisConnect("Wallet Connect");
    });

    return () => {
      provider?.removeListener("session_update", () => {});
      provider?.removeListener("session_delete", handleDisConnect);
    };
  }
};

  useEffect(() => {
    if (
      address &&
      isConnected &&
      chain?.id == runningchain.chainId &&
      connector
    ) {
      dispatch(setConnector(connector));
      walletConnectFunc(
        address,
        dispatch,
        handleWalletConnectDisconnect,
        connector
      );
    } else if (chain?.id && runningchain.chainId != chain?.id) {
      toast.loading(
        `waiting for switch ${runningchain.runningNetwork} Network`
      );
      switchNetwork(runningchain.chainId);
    }
  }, [connector]);

  useEffect(() => {
    if (!addressSlice?.WalletAddress) {
      if (error) {
        // toast.error(`Please Switch to the ${runningchain?.runningNetwork}`);
        disconnect();
      }
    }
  }, [error]);

  useEffect(() => {
    callnetworks();
  }, []);

  useEffect(() => {
    walletConnectCall();
  }, [address]);


  return (
    <div className="connect-wallet">
      <CustomButton
        text={
          addressSlice?.walletAddress
            ? trimAddress(addressSlice?.walletAddress)
            : "Connect Wallet"
        }
        icon={<RightArrowIcon />}
        onClick={handleClick}
      />
      <div className={`wallet-list ${active ? "wallet-list__show" : ""} `}>
        <div className="wallet-list__head">
          <h5>
            {addressSlice?.walletAddress
              ? "Disconnect Wallet"
              : "Connect Wallet"}
          </h5>
          <button type="button" onClick={handleClick}>
            <CloseIcon />
          </button>
        </div>
        <div className="wallet-list__body">
          <ul className="wallet-list__ul">
            {addressSlice?.walletAddress
              ? walletList
                  ?.filter(
                    (item: any, index: any) =>
                      item?.name == addressSlice?.walletType
                  )
                  .map((item, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        className="wallet-list__button"
                        onClick={() => handleDisConnect(item?.name)}
                      >
                        <span>
                          <img src={item.icon} alt={item.name} />
                        </span>
                        Disconnect {item.name}
                      </button>
                    </li>
                  ))
              : walletList.map((item, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      className="wallet-list__button"
                      onClick={() => handleConnect(item?.name)}
                    >
                      <span>
                        <img src={item.icon} alt={item.name} />
                      </span>
                      {item.name}
                    </button>
                  </li>
                ))}
                
          </ul>
          {!addressSlice?.walletAddress && (
            <p>
              <span>Note:</span> Start your journey by connecting with one of the
              above wallets. be sure to store your private keys or seed phrases
              securely. never share them with anyone.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
