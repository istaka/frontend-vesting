/// <reference types="react-scripts" />
/// <reference types="@web3modal/wagmi" />

interface Window {
  ethereum: any;
}

declare global {
  interface Window {
    ethereum: any;
    web3: any;
    BinanceChain: any;
    aptos: any;
  }
}
