import { type AppType } from "next/app";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dynamic from "next/dynamic";
import { api } from "@/utils/api";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai, sepolia } from "viem/chains";

const { chains, publicClient } = configureChains(
  [polygonMumbai, sepolia],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "NexeraID Example apps",
  projectId: "5d874ef9e44150c54831f6ba7e6d6228",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastContainer />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default dynamic(() => Promise.resolve(api.withTRPC(MyApp)), {
  ssr: false,
});
