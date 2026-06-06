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
    let pfpRaw = data[1] as string;
    let parsedPfp = pfpRaw;
    let xUsername = "";
    let discordUsername = "";
    try {
      if (pfpRaw.startsWith("{")) {
        const obj = JSON.parse(pfpRaw);
        parsedPfp = obj.image || "";
        xUsername = obj.x || "";
        discordUsername = obj.discord || "";
      }
    } catch (e) {}

    return {
      username: data[0] as `${string}.ritual`,
      pfp: parsedPfp,
      xUsername,
      discordUsername,
      memberSince: new Date(Number(data[2]) * 1000).toISOString(),
      walletAddress: address as string
    };
  }

  return null;
}
