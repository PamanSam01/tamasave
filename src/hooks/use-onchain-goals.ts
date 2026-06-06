"use client";

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { goalVaultAbi, goalVaultAddress } from "@/lib/contracts";
import { Goal } from "@/lib/types";
import { formatUnits } from "viem";

// Token mapping (simplified for MVP)
function getTokenSymbol(address: string) {
  if (address.toLowerCase() === "0x1e9e15b17da7cf901d2ada5718ef5cdfb0b9f543") return "USDC";
  return "Unknown";
};

export function useOnchainGoals() {
  const { address } = useAccount();

  // 1. Fetch the goal IDs owned by this user
  const { data: goalIds, isLoading: isLoadingIds } = useReadContract({
    address: goalVaultAddress,
    abi: goalVaultAbi,
    functionName: "getOwnerGoals",
    args: [address as `0x${string}`],
    query: { enabled: !!address, refetchInterval: 5000 }
  });

  // 2. Fetch the details of each goal via Multicall
  const { data: goalsRaw, isLoading: isLoadingDetails } = useReadContracts({
    contracts: (goalIds || []).map((id) => ({
      address: goalVaultAddress,
      abi: goalVaultAbi,
      functionName: "goals",
      args: [id]
    })),
    query: { enabled: !!goalIds && goalIds.length > 0, refetchInterval: 5000 }
  });

  // 3. Transform the raw data into our Goal type
  const goals: Goal[] = [];

  if (goalsRaw && goalIds) {
    goalsRaw.forEach((res, index) => {
      const result = res as any;
      if (result.status === "success" && result.result) {
        const [owner, name, tokenAddress, targetAmount, savedAmount, completed, canceled] = result.result as [
          `0x${string}`,
          string,
          `0x${string}`,
          bigint,
          bigint,
          boolean,
          boolean
        ];

        // Skip rendering canceled goals to keep the dashboard clean
        if (canceled) return;

        // Deterministic UI fallbacks for offchain data (MVP)
        const idStr = goalIds[index].toString();
        const colors: Goal["color"][] = ["candy", "mint", "peach", "sky", "lilac"];
        
        goals.push({
          id: idStr,
          ownerUsername: "You", // In a full app, resolve address to Ritual Identity
          name,
          targetAmount: Number(formatUnits(targetAmount, 18)),
          savedAmount: Number(formatUnits(savedAmount, 18)),
          token: getTokenSymbol(tokenAddress) as Goal["token"],
          autoSaveAmount: 0, // Requires reading GoalManager schedule
          frequency: "weekly",
          nextSaveAt: "Paused",
          streak: 0,
          scheduleId: "",
          status: completed ? "completed" : "active",
          petName: `Pet #${idStr}`,
          color: colors[Number(idStr) % colors.length],
          history: [] // Event logs needed
        });
      }
    });
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const activeGoals = goals.filter((g) => g.status === "active").length;

  return {
    goals,
    totalSaved,
    activeGoals,
    longestStreak: 0, // Placeholder until events are parsed
    isLoading: isLoadingIds || isLoadingDetails
  };
}
