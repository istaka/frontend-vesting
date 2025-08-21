import { Metamask, Wallet_Connect } from "../../Components/common/Toasts/ConstVar";
import { toast } from "../../Components/common/Toasts/Toast";
import UniversalProvider from "@walletconnect/universal-provider";

const notProvider = () => {
  const quote = "Please install and initialize Metamask wallet extension first";
  setTimeout(() => {
    window.open(
      "https://metamask.io/",
      "_blank" // <- This is what makes it open in a new window.
    );
    // window.location.href = "https://metamask.io/";
  }, 3000);
  toast.error(quote);
  return false;
};

export const wcprovider = async () => {
  const provider = await UniversalProvider.init({
    logger: "info",
    relayUrl: "ws://<relay-url>",
    // relayUrl: "wss://relay.walletconnect.org",
    projectId: "e3377bcd2327e7994715bd9df53743bd",
    metadata: {
      name: "React App",
      description: "React App for WalletConnect",
      url: "https://walletconnect.com/",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
    client: undefined, // optional instance of @walletconnect/sign-client
  });

  //  const web3Provider= new ethers?.providers.Web3Provider(provider);

  return provider;
};

export const metamaskProvider = async () => {
  try {
    let provider: any;
    let Window: any = window;
    if (Window.ethereum.providers) {
      provider = await Window.ethereum.providers.find(
        (provider: any) => provider.isMetaMask
      );
      if (!provider) {
        notProvider();
      } else {
        return provider;
      }
    } else if (Window.ethereum.isMetaMask) {
      provider = await Window.ethereum;
      return provider;
    } else if (Window) {
      provider = await Window.ethereum;
      return provider;
    }
  } catch (error) {
    notProvider();
    return false;
  }
};

export const walletProvider = async (walletType: any) => {
  if (walletType == Metamask) return metamaskProvider();
  else if (walletType == Wallet_Connect) return wcprovider();
};