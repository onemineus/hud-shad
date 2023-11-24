"use client";
import { Toaster } from "@/components/ui/toaster";
import Hud from "@/components/hud";
import {
  WagmiConfig,
  createConfig,
  configureChains,
  mainnet,
  useAccount,
  useConnect,
  useEnsName,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { goerli } from "viem/chains";
import Book from "@/components/book";

export default function Home() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, goerli],
    [
      alchemyProvider({ apiKey: "0srkScMYKOU5dsf0lT4jtn8VtzIUuMEh" }),
      publicProvider(),
    ]
  );

  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({
        chains,
        options: {
          shimDisconnect: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  });
  return (
    <WagmiConfig config={config}>
      {/* <Hud /> */}
      <Book />
      <Toaster />
    </WagmiConfig>
  );
}
