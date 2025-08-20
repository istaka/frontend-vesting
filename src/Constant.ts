// export const RPCURL = "https://rpc-mumbai.maticvigil.com/";
// export const RPCURL = "https://polygon-rpc.com";
export const RPCURL = process.env.REACT_APP_POLYGON_URL as string;


export const APIURL = {
  TRANSACTION_HISTORY: "/transactions",
  SELL_TRANSACTION_HISTORY: "/user-buy-sell",
  ALLTRANSACTION_LIST: "/getAllTransactionsAmount",
  ALL_USER_TRANSACTION_LIST: "/getAllUserVestingContract",
  SELL_CAP: '/user-sell-cap',
};

export const ProjectId = "e3377bcd2327e7994715bd9df53743bd";
export const metadata = {
  name: "iPazaLabs",
  description: "iPazaLabs",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};


type runningchainType = {
  chainId: number;
  runningNetwork: string;
};

export const runningchain: runningchainType = {
  chainId: Number(process.env.REACT_APP_CHAIN_ID),
  runningNetwork: process.env.REACT_APP_RUNNING_NETWORK as string,
};
export const chainIds = [Number(process.env.REACT_APP_CHAIN_ID)];


export const SITE_URL = process.env.REACT_APP_SITE_URL;

export const DAPP_URL_METAMASK = process.env.REACT_APP_DAPP_URL_METAMASK as string;

export const Paza_Address = process.env.REACT_APP_PAZZA_ADDRESS;

export const VESTING_CONTRACT: any = process.env.REACT_APP_PREFERRED_CONTRACT
  ? process.env.REACT_APP_PREFERRED_CONTRACT.split(",").map(addr => addr.trim())
  : [];


export const PreferredContract = VESTING_CONTRACT;


export const BONDING_CURVE_ADDRESS =  process.env.REACT_APP_BONDINGCURVE;


export const EXPLORER_URL = `${process.env.REACT_APP_EXPLORER}/tx/`;

