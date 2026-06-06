"use client";

import { useAccount, useReadContract } from "wagmi";
import { ritualIdentityRegistryAddress, ritualIdentityRegistryAbi } from "@/lib/contracts";
import { RitualIdentity } from "@/lib/types";

export function useRitualIdentity(): RitualIdentity | null {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: ritualIdentityRegistryAddress,
    abi: ritualIdentityRegistryAbi,
    functionName: "identityOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  });

  if (data && data[0]) {
    return {
      username: data[0] as `${string}.ritual`,
      pfp: data[1] as string,
      memberSince: new Date(Number(data[2])).toISOString(),
      walletAddress: address as string
    };
  }

  return null;
}
