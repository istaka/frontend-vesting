// import AvalancheIcon from "../../Assets/Images/Avalanche.svg";
// import EthereumIcon from "../../Assets/Images/Ethereum.svg";
// import PolygonIcon from "../../Assets/Images/Polygon.svg";

export const VALID_CHAINS: string[] = [
  "Avalanche",
  "AvalancheFuji",
  "Ethereum",
  "EthereumGoerli",
  "EthereumSepolia",
  "Optimism",
  "OptimismGoerli",
  "Polygon",
  "PolygonMumbai",
  "Amoy",
];

export type ChainName =
  | "Avalanche"
  | "AvalancheFuji"
  | "Ethereum"
  | "EthereumGoerli"
  | "EthereumSepolia"
  | "Optimism"
  | "OptimismGoerli"
  | "Polygon"
  | "PolygonMumbai"
  | "Amoy";

export enum ChainId {
  Avalanche = 43114,
  AvalancheFuji = 43113,
  Ethereum = 1,
  EthereumGoerli = 5,
  EthereumSepolia = 11155111,
  Optimism = 10,
  OptimismGoerli = 420,
  Polygon = 137,
  PolygonMumbai = 80001,
  Amoy = 80002,
}

const ChainMap: Record<ChainName, ChainId> = {
  Avalanche: ChainId.Avalanche,
  AvalancheFuji: ChainId.AvalancheFuji,
  Ethereum: ChainId.Ethereum,
  EthereumGoerli: ChainId.EthereumGoerli,
  EthereumSepolia: ChainId.EthereumSepolia,
  Optimism: ChainId.Optimism,
  OptimismGoerli: ChainId.OptimismGoerli,
  Polygon: ChainId.Polygon,
  PolygonMumbai: ChainId.PolygonMumbai,
  Amoy: ChainId.Amoy,
};

export function isValidChainName(value: string): value is ChainName {
  return VALID_CHAINS?.includes(value);
}

export function toChainId(name: ChainName): number {
  return ChainMap[name];
}

export const CHAIN_WALLET_NAME: Record<number, string> = {
  [ChainId.Avalanche]: "Avalanches C-Chain",
  [ChainId.AvalancheFuji]: "Avalanche Fuji Testnet",
  [ChainId.Ethereum]: "Ethereum Mainnet",
  [ChainId.EthereumGoerli]: "Ethereum Goerli Testnet",
  [ChainId.EthereumSepolia]: "Ethereum Sepolia Testnet",
  [ChainId.Optimism]: "Optimism Mainnet",
  [ChainId.OptimismGoerli]: "Optimism Goerli Testnet",
  [ChainId.Polygon]: "Polygon Mainnet",
  [ChainId.PolygonMumbai]: "Matic Mumbai",
  [ChainId.Amoy]: "Amoy",
};

export const CHAIN_CURRENCY_SYMBOL: Record<number, string> = {
  [ChainId.Avalanche]: "AVAX",
  [ChainId.AvalancheFuji]: "AVAX",
  [ChainId.Ethereum]: "ETH",
  [ChainId.EthereumGoerli]: "GoerliETH",
  [ChainId.EthereumSepolia]: "SepoliaETH",
  [ChainId.Optimism]: "ETH",
  [ChainId.OptimismGoerli]: "ETH",
  [ChainId.Polygon]: "MATIC",
  [ChainId.PolygonMumbai]: "MATIC",
  [ChainId.Amoy]: "Amoy",
};

export const CHAIN_CURRENCY_DECIMAL: Record<number, number> = {
  [ChainId.Avalanche]: 18,
  [ChainId.AvalancheFuji]: 18,
  [ChainId.Ethereum]: 18,
  [ChainId.EthereumGoerli]: 18,
  [ChainId.EthereumSepolia]: 18,
  [ChainId.Optimism]: 18,
  [ChainId.OptimismGoerli]: 18,
  [ChainId.Polygon]: 18,
  [ChainId.PolygonMumbai]: 18,
  [ChainId.Amoy]: 18,
};

export const CHAIN_NAME: Record<number, string> = {
  [ChainId.Avalanche]: "Avalanche",
  [ChainId.AvalancheFuji]: "Avalanche",
  [ChainId.Ethereum]: "Ethereum",
  [ChainId.EthereumGoerli]: "Ethereum",
  [ChainId.EthereumSepolia]: "Ethereum",
  [ChainId.Optimism]: "Optimism",
  [ChainId.OptimismGoerli]: "Optimism",
  [ChainId.Polygon]: "Polygon",
  [ChainId.PolygonMumbai]: "Polygon",
  [ChainId.Amoy]: "Amoy",
};

// export const CHAIN_ICON: Record<number, string> = {
//   [ChainId.Avalanche]: AvalancheIcon,
//   [ChainId.AvalancheFuji]: AvalancheIcon,
//   [ChainId.Ethereum]: EthereumIcon,
//   [ChainId.EthereumGoerli]: EthereumIcon,
//   [ChainId.EthereumSepolia]: EthereumIcon,
//   // [ChainId.Optimism]: OptimismIcon,
//   // [ChainId.OptimismGoerli]: OptimismIcon,
//   [ChainId.Polygon]: PolygonIcon,
//   [ChainId.PolygonMumbai]: PolygonIcon,
// };

export const CHAIN_EXPLORER: Record<number, string> = {
  [ChainId.Avalanche]: "https://snowtrace.io/",
  [ChainId.AvalancheFuji]: "https://testnet.snowtrace.io/",
  [ChainId.Ethereum]: "https://mainnet.infura.io/v3/",
  [ChainId.EthereumGoerli]: "https://goerli.etherscan.io/",
  [ChainId.EthereumSepolia]: "https://sepolia.etherscan.io/",
  [ChainId.Optimism]: "https://optimistic.etherscan.io/",
  [ChainId.OptimismGoerli]: "https://goerli-optimism.etherscan.io/",
  [ChainId.Polygon]: "https://polygonscan.com/",
  [ChainId.PolygonMumbai]: "https://mumbai.polygonscan.com/",
  [ChainId.Amoy]: "https://amoy.polygonscan.com/",
};

export const CHAIN_RPC: Record<number, string> = {
  [ChainId.Avalanche]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.AvalancheFuji]: "https://api.avax-test.network/ext/bc/C/rpc",
  [ChainId.Ethereum]: "https://etherscan.io",
  [ChainId.EthereumGoerli]: "https://goerli.infura.io/v3",
  [ChainId.EthereumSepolia]: "https://sepolia.infura.io/v3",
  [ChainId.Optimism]: "https://mainnet.optimism.io",
  [ChainId.OptimismGoerli]: "https://goerli.optimism.io",
  [ChainId.Polygon]: "https://polygon-rpc.com/",
  // [ChainId.PolygonMumbai]: "https://rpc-mumbai.maticvigil.com/",
  [ChainId.PolygonMumbai]:
    "https://polygon-mumbai.g.alchemy.com/v2/H8ekimapNV9pE-L9HLCn1CbTa5KsP1Jl",
  [ChainId.Amoy]: "https://rpc-amoy.polygon.technology",
};
