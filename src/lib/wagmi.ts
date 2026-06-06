"use client";

import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { walletConnect, injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const ritualChain = defineChain({
  id: 1979,
  name: "Ritual Chain",
  nativeCurrency: {
    decimals: 18,
    name: "RITUAL",
    symbol: "RITUAL"
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RITUAL_RPC_URL ?? "https://rpc.ritualfoundation.org/"]
    }
  },
  blockExplorers: {
    default: {
      name: "Ritual Explorer",
      url: process.env.NEXT_PUBLIC_RITUAL_EXPLORER_URL ?? "https://explorer.ritualfoundation.org/"
    }
  },
  testnet: true
});

export const wagmiConfig = createConfig({
  chains: [ritualChain],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo"
    })
  ],
  transports: {
    [ritualChain.id]: http()
  },
  ssr: true
});

export const queryClient = new QueryClient();
