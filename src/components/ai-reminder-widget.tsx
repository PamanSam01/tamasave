"use client";

import { useMemo, useState, useEffect } from "react";
import { Zap, Bell, CheckCircle2, Bot, Coins } from "lucide-react";
import { useOnchainGoals } from "@/hooks/use-onchain-goals";
import { useLiveActivity } from "@/hooks/use-live-activity";
import { useReadContracts, useWriteContract, useAccount } from "wagmi";
import { goalManagerAddress, goalManagerAbi } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { MOCK_USDC_ADDRESS } from "@/components/mint-usdc-button";
import { parseUnits } from "viem";

const erc20Abi = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

export function AiReminderWidget() {
  const { goals, isLoading: isGoalsLoading } = useOnchainGoals();
  const { activities, isLoading: isActivityLoading } = useLiveActivity();

  const { address } = useAccount();

  // L402 State
  const [credits, setCredits] = useState<number>(0);
  const [hasScanned, setHasScanned] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (!address) {
      setCredits(0);
      setHasScanned(false);
      return;
    }

    const saved = localStorage.getItem(`ai_credits_${address}`);
    if (saved) setCredits(Number(saved));
    else setCredits(0);

    const lastScan = localStorage.getItem(`ai_last_scan_${address}`);
    if (lastScan) {
      // Keep results visible for 5 minutes after scanning
      if (Date.now() - Number(lastScan) < 5 * 60 * 1000) {
        setHasScanned(true);
      } else {
        setHasScanned(false);
      }
    } else {
      setHasScanned(false);
    }
  }, [address]);

  const activeGoals = useMemo(() => {
    return goals.filter(g => g.status === "active");
  }, [goals]);

  // Fetch Schedule IDs
  const { data: scheduleIdsData } = useReadContracts({
    contracts: activeGoals.map(g => ({
      address: goalManagerAddress,
      abi: goalManagerAbi,
      functionName: "goalToSchedule",
      args: [BigInt(g.id)]
    }))
  });

  // Fetch Schedules
  const validScheduleIds = useMemo(() => {
    if (!scheduleIdsData) return [];
    return (scheduleIdsData as any[])
      .map(res => (res?.result ? (res.result as string) : "0x0000000000000000000000000000000000000000") as `0x${string}`)
      .filter(id => id !== "0x0000000000000000000000000000000000000000");
  }, [scheduleIdsData]);

  const { data: schedulesData } = useReadContracts({
    contracts: validScheduleIds.map(id => ({
      address: goalManagerAddress,
      abi: goalManagerAbi,
      functionName: "schedules",
      args: [id]
    }))
  });

  // Determine Hungry Pets
  const hungryPets = useMemo(() => {
    if (!schedulesData || !activities) return [];

    const hungry: { name: string; id: string }[] = [];

    activeGoals.forEach((goal, index) => {
      const scheduleRes = (schedulesData as any[])[index];
      if (!scheduleRes || !scheduleRes.result) return;

      const scheduleRaw = scheduleRes.result;
      const isArray = Array.isArray(scheduleRaw);
      const cadenceSeconds = Number(isArray ? scheduleRaw[3] : scheduleRaw.cadenceSeconds);
      const sNextRunAt = Number(isArray ? scheduleRaw[4] : scheduleRaw.nextRunAt);
      const sStatus = isArray ? scheduleRaw[5] : scheduleRaw.status;

      // If paused explicitly, we might skip. But if status is 0 and nextRunAt is 0, it means NO schedule.
      if (sStatus !== 0) return;

      let timestampMs = sNextRunAt;
      if (timestampMs > 10000000000) {
        // CratD2C compensation
        timestampMs = timestampMs + (cadenceSeconds * 999);
      } else {
        timestampMs = timestampMs * 1000;
      }

      if (timestampMs > 0 && timestampMs > Date.now()) {
        // On strict schedule cooldown
        return;
      }

      // Fallback: check global activities for very recent manual deposits
      const lastDeposit = activities.find(a => a.type === "deposit" && a.goalId === goal.id);
      if (lastDeposit) {
        let cadenceMs = 86400 * 1000;
        if (cadenceSeconds === 604800) cadenceMs = 7 * 86400 * 1000;
        else if (cadenceSeconds === 2592000) cadenceMs = 30 * 86400 * 1000;
        else if (cadenceSeconds === 0) cadenceMs = 86400 * 1000; // default to daily if no schedule

        const lastDepositTime = new Date(lastDeposit.createdAt).getTime();
        if (lastDepositTime + cadenceMs > Date.now()) {
          // Recently fed manually, so it's not hungry yet
          return;
        }
      }

      // If neither smart contract nor recent activity says it's on cooldown, it's hungry!
      hungry.push({ name: goal.name, id: goal.id });
    });

    return hungry;
  }, [activeGoals, schedulesData, activities]);

  const buyCredits = async () => {
    if (!address) return;
    setIsBuying(true);
    try {
      await writeContractAsync({
        address: MOCK_USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "transfer",
        args: ["0x000000000000000000000000000000000000dEaD", parseUnits("1", 18)]
      });
      const newCredits = credits + 10;
      setCredits(newCredits);
      localStorage.setItem(`ai_credits_${address}`, newCredits.toString());
    } catch (e) {
      // console.error(e);
      // console.log("Failed to purchase L402 credits.");
    } finally {
      setIsBuying(false);
    }
  };

  const handleScan = () => {
    if (!address || credits < 1) return;
    const newCredits = credits - 1;
    setCredits(newCredits);
    localStorage.setItem(`ai_credits_${address}`, newCredits.toString());
    localStorage.setItem(`ai_last_scan_${address}`, Date.now().toString());
    setHasScanned(true);
  };

  if (isGoalsLoading || isActivityLoading) {
    return (
      <div className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm opacity-50">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-5 w-5 animate-pulse" />
          <h2 className="font-pixel text-sm">Ritual AI Sync...</h2>
        </div>
      </div>
    );
  }

  // If there are no active goals at all
  if (activeGoals.length === 0) return null;

  const allFed = hungryPets.length === 0;

  return (
    <div className={`rounded-lg border-2 border-ink p-4 shadow-pixel-sm transition-colors ${hasScanned ? (allFed ? 'bg-mint/30' : 'bg-butter/30') : 'bg-shell/50'}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded border-2 border-ink ${hasScanned ? (allFed ? 'bg-mint' : 'bg-butter') : 'bg-card'}`}>
            <Bot className="h-4 w-4" />
          </div>
          <h2 className="font-pixel text-sm leading-6">Ritual AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1 rounded bg-ink px-2 py-1 text-xs font-bold text-screen">
          <Zap className="h-3 w-3 text-butter" /> {credits}
        </div>
      </div>
      
      {!hasScanned ? (
        <div className="space-y-3">
          <p className="text-sm font-bold text-ink/75">
            AI is on standby. Pay 1 L402 credit to infer pet status.
          </p>
          {credits > 0 ? (
            <Button onClick={handleScan} className="w-full font-bold h-9">
              Scan Pets (1 Credit)
            </Button>
          ) : (
            <Button onClick={buyCredits} disabled={isBuying} variant="peach" className="w-full font-bold h-9">
              <Coins className="mr-2 h-4 w-4" />
              {isBuying ? "Processing..." : "Buy 10 Credits (1 USDC)"}
            </Button>
          )}
        </div>
      ) : (
        <>
          {allFed ? (
            <div className="flex items-start gap-2 text-sm font-bold text-ink/80">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
              <p>All pets are fed and happy! No pending deposits for this period.</p>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-xs font-bold text-red-600 flex items-center gap-1">
                <Bell className="h-3 w-3" /> Attention Required
              </p>
              <ul className="space-y-1 text-sm font-bold">
                {hungryPets.map(pet => (
                  <li key={pet.id} className="flex items-center gap-2 border-l-2 border-red-500 pl-2">
                    <span className="text-ink/80">Pet #{pet.id}:</span>
                    <span className="text-ink">{pet.name} is hungry!</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
