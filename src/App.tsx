import { Children, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loader } from "./Components/UI";
import { Home } from "./Pages";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./redux/store";
import { Provider } from "react-redux";

import { publicProvider } from "wagmi/providers/public";
import { WagmiConfig, configureChains, createConfig } from "wagmi";

import { polygon, polygonMumbai } from "wagmi/chains";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { metadata, ProjectId } from "./Constant";
import Sellpage from "./Pages/BuySell/Sellsec/Sellpage";
import PrimaryLayout from "./Components/Layout/PrimaryLayout/PrimaryLayout";
import ErrorPage from "./Pages/ErrorPage";
import ErrorBoundary from "./Components/ErrorBoundary";
import Sell from "./Pages/BuySell/Sell";

const projectId = ProjectId;

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
  [polygon],
  [walletConnectProvider({ projectId }), publicProvider()]
);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId, showQrModal: false, metadata },
    }),

    new EIP6963Connector({ chains }),
  ],
  publicClient,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: polygon,
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6",
  ],
  includeWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6",
  ],
});

let persistor = persistStore(store);

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrimaryLayout />,
    errorElement: <ErrorPage />, // Show real error message here
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <Sell />,
        path: "sell",
        errorElement: <ErrorPage />, // Show error on child routes too
      },
    ],
  },
]);

// console.log = () => {};
// console.warn = () => {};
// console.error = () => {};

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ErrorBoundary>
            <Suspense fallback={<> <Loader /> </>}>
            <Loader />
              <RouterProvider router={router} />
            </Suspense>
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </WagmiConfig>
  );
}

export const storeInstance: any = store;
export default App;
