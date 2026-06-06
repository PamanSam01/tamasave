"use client";

import { notFound } from "next/navigation";
import { Award, History, LockOpen, Sparkles, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ConfettiPop } from "@/components/confetti-pop";
import { PetSprite } from "@/components/pet-sprite";
import { Progress } from "@/components/ui/progress";
import { SchedulerPanel } from "@/components/scheduler-panel";
import { CancelGoalButton } from "@/components/cancel-goal-button";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getPetStage, getProgress, stageCopy } from "@/lib/pet";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { goalVaultAbi, goalVaultAddress, goalManagerAbi, goalManagerAddress } from "@/lib/contracts";
import { MOCK_USDC_ADDRESS } from "@/components/mint-usdc-button";
import { useState } from "react";
import { Goal } from "@/lib/types";
import { formatUnits, parseUnits } from "viem";
import { useGoalHistory } from "@/hooks/use-goal-history";

// Helper to decode token
function getTokenSymbol(address: string) {
  if (address.toLowerCase() === MOCK_USDC_ADDRESS.toLowerCase()) return "USDC";
  return "Unknown";
}

const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

export function GoalDetailClient({ id }: { id: string }) {
  const { address } = useAccount();
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { history: goalHistory } = useGoalHistory(id);

  const { data: goalRaw, isLoading, refetch } = useReadContract({
    address: goalVaultAddress,
    abi: goalVaultAbi,
    functionName: "goals",
    args: [BigInt(id)],
    query: { enabled: true, refetchInterval: 5000 }
  });

  const { data: scheduleIdRaw } = useReadContract({
    address: goalManagerAddress,
    abi: goalManagerAbi,
    functionName: "goalToSchedule",
    args: [BigInt(id)],
    query: { enabled: true }
  });

  const { data: scheduleRaw } = useReadContract({
    address: goalManagerAddress,
    abi: goalManagerAbi,
    functionName: "schedules",
    args: [scheduleIdRaw as `0x${string}`],
    query: { enabled: !!scheduleIdRaw && scheduleIdRaw !== "0x0000000000000000000000000000000000000000000000000000000000000000", refetchInterval: 5000 }
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center font-pixel">Loading Onchain Data...</div>
      </AppShell>
    );
  }

  if (!goalRaw) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center font-pixel text-red-500">Goal Not Found!</div>
      </AppShell>
    );
  }

  const [owner, name, tokenAddress, targetAmountRaw, savedAmountRaw, completed, canceled] = goalRaw as [
    `0x${string}`,
    string,
    `0x${string}`,
    bigint,
    bigint,
    boolean,
    boolean
  ];

  const targetAmount = Number(formatUnits(targetAmountRaw, 18));
  const savedAmount = Number(formatUnits(savedAmountRaw, 18));
  const token = getTokenSymbol(tokenAddress) as Goal["token"];
  
  const progress = getProgress(savedAmount, targetAmount);
  const stage = getPetStage(progress);
  const celebratory = stage === "Legendary" || progress === 100;

  // Calculate real schedule details
  let autoSaveAmount = 10;
  let frequency: Goal["frequency"] = "daily";
  let nextSaveAt = "Paused";
  let scheduleIdStr = "None";
  let timestampMs = 0;

  if (scheduleRaw) {
    const isArray = Array.isArray(scheduleRaw);
    const sAmount = isArray ? scheduleRaw[2] : (scheduleRaw as any).amount;
    const sCadenceSeconds = isArray ? scheduleRaw[3] : (scheduleRaw as any).cadenceSeconds;
    const sNextRunAt = isArray ? scheduleRaw[4] : (scheduleRaw as any).nextRunAt;
    const sStatus = isArray ? scheduleRaw[5] : (scheduleRaw as any).status;

    autoSaveAmount = Number(formatUnits(sAmount || BigInt(0), 18));
    
    if (Number(sCadenceSeconds) === 86400) frequency = "daily";
    else if (Number(sCadenceSeconds) === 604800) frequency = "weekly";
    else if (Number(sCadenceSeconds) === 2592000) frequency = "monthly";
    else frequency = "daily";

    if (sStatus === 0 && sNextRunAt) {
      const nextRunAtNum = Number(sNextRunAt);
      const cadenceNum = Number(sCadenceSeconds);
      
      timestampMs = nextRunAtNum;
      if (nextRunAtNum > 10000000000) {
        // CratD2C Testnet Bug compensation
        timestampMs = nextRunAtNum + (cadenceNum * 999);
      } else {
        timestampMs = nextRunAtNum * 1000;
      }
      
      nextSaveAt = new Date(timestampMs).toLocaleString();
    }
    scheduleIdStr = (scheduleIdRaw as string).substring(0, 10) + "...";
  }

  const streak = 0;
  
  const colors: Goal["color"][] = ["candy", "mint", "peach", "sky", "lilac"];
  const color = colors[Number(id) % colors.length];

  // Cooldown Logic based entirely on Smart Contract nextRunAt OR Activity History
  let onCooldown = false;
  let cooldownText = "";
  let targetCooldownMs = 0;
  
  if (timestampMs > 0 && timestampMs > Date.now()) {
    targetCooldownMs = timestampMs;
  } else {
    // Fallback: check history if schedule is paused/missing
    const lastDeposit = goalHistory.find(a => a.label.toLowerCase().includes("fed pet"));
    if (lastDeposit) {
      let cadenceMs = 86400 * 1000;
      if (frequency === "weekly") cadenceMs = 7 * 86400 * 1000;
      if (frequency === "monthly") cadenceMs = 30 * 86400 * 1000;

      const lastDepositTime = new Date(lastDeposit.createdAt).getTime();
      const nextAvailableTime = lastDepositTime + cadenceMs;
      if (nextAvailableTime > Date.now()) {
        targetCooldownMs = nextAvailableTime;
      }
    }
  }

  if (targetCooldownMs > Date.now()) {
    onCooldown = true;
    const diffMs = targetCooldownMs - Date.now();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) {
      cooldownText = `Wait ${days} days ${hours % 24} hours more`;
    } else {
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      cooldownText = `Wait ${hours} hours ${mins} minutes more`;
    }
  }

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      const amountToDeposit = parseUnits(autoSaveAmount.toString(), 18);
      // 1. Approve
      await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [goalVaultAddress, amountToDeposit]
      });
      
      // console.log("Approve successful! Please confirm the Deposit transaction in MetaMask.");

      await writeContractAsync({
        address: goalVaultAddress,
        abi: goalVaultAbi,
        functionName: "deposit",
        args: [BigInt(id), amountToDeposit]
      });

      const currentSettings = JSON.parse(localStorage.getItem("tamasave_settings") || "{}");
      if (currentSettings.soundEnabled !== false) {
        import("@/lib/effects").then(m => m.playPixelSound());
      }
      if (currentSettings.confettiEnabled !== false) {
        import("@/lib/effects").then(m => m.triggerConfetti());
      }

      // console.log("Deposit successful!");
      refetch();
    } catch (error: any) {
      // console.error(error);
      // console.log("Failed to deposit: " + error.message);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await writeContractAsync({
        address: goalVaultAddress,
        abi: goalVaultAbi,
        functionName: "withdrawWhenCompleted",
        args: [BigInt(id)]
      });

      // console.log("Withdraw successful! Congratulations on reaching your Goal!");
      refetch();
    } catch (error: any) {
      // console.error(error);
      // console.log("Failed to withdraw: " + error.message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <AppShell>
      <ConfettiPop active={celebratory} />
      {canceled && (
        <div className="mb-4 rounded border-2 border-red-900 bg-red-100 p-4 text-center font-bold text-red-900">
          <AlertTriangle className="mr-2 inline-block h-5 w-5" />
          This goal has been canceled. Funds have been returned (minus 5% penalty).
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <section className="space-y-4">
          <div className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-ink/70">Pet #{id}</p>
                <h1 className="font-pixel text-xl leading-9">{name}</h1>
              </div>
              <span className="rounded border-2 border-ink bg-butter px-3 py-2 text-xs font-bold">{stage}</span>
            </div>
            <PetSprite stage={stage} color={color} size="lg" />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>{formatCurrency(savedAmount, token)}</span>
                <span>{formatCurrency(targetAmount, token)}</span>
              </div>
              <Progress value={progress} className="h-5" />
              <p className="text-sm font-bold text-ink/75">
                {progress}% · {stageCopy[stage]}
              </p>
            </div>
          </div>
          
          <SchedulerPanel goal={{
            id, ownerUsername: "You", name, targetAmount, savedAmount, token, autoSaveAmount, frequency, nextSaveAt, streak, scheduleId: scheduleIdStr, status: completed ? "completed" : "active", petName: `Pet #${id}`, color, history: []
          }} />
        </section>

        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border-2 border-ink bg-mint p-4 shadow-pixel-sm">
              <Sparkles className="mb-2 h-5 w-5" />
              <p className="text-xs font-bold uppercase text-ink/70">Streak</p>
              <p className="font-pixel text-lg leading-8">{streak}x</p>
            </div>
            <div className="rounded-lg border-2 border-ink bg-peach p-4 shadow-pixel-sm">
              <LockOpen className="mb-2 h-5 w-5" />
              <p className="text-xs font-bold uppercase text-ink/70">Withdraw</p>
              <p className="font-bold">{progress === 100 || completed ? "Unlocked" : "At 100%"}</p>
            </div>
            <div className="rounded-lg border-2 border-ink bg-sky p-4 shadow-pixel-sm">
              <Award className="mb-2 h-5 w-5" />
              <p className="text-xs font-bold uppercase text-ink/70">Badges</p>
              <p className="font-pixel text-lg leading-8">0</p>
            </div>
          </div>

          {!completed && !canceled && (
             <div className="rounded-lg border-2 border-ink bg-shell p-4 shadow-pixel-sm">
               <h2 className="mb-2 font-pixel text-sm">Manual Deposit</h2>
               <p className="mb-4 text-xs font-bold text-ink/70">
                 {onCooldown 
                   ? `You have already saved for this period. ${cooldownText}`
                   : `Deposit ${formatCurrency(autoSaveAmount, token)} now (requires 2x MetaMask confirmations: Approve & Deposit).`}
               </p>
               <Button 
                 onClick={handleDeposit} 
                 disabled={isDepositing || onCooldown} 
                 className="w-full font-bold"
                 variant={onCooldown ? "outline" : "default"}
               >
                 {isDepositing ? "Processing..." : onCooldown ? "On Cooldown" : "Deposit Now"}
               </Button>
             </div>
          )}

          {progress >= 100 && !canceled && !completed && (
             <div className="rounded-lg border-2 border-green-900 bg-green-100 p-4 shadow-pixel-sm">
               <h2 className="mb-2 font-pixel text-sm text-green-900">Goal Reached!</h2>
               <p className="mb-4 text-xs font-bold text-green-800">
                 Congratulations! You have reached your savings target. You may now withdraw your funds.
               </p>
               <Button onClick={handleWithdraw} disabled={isWithdrawing} className="w-full border-green-900 bg-green-500 font-bold hover:bg-green-600 text-white">
                 {isWithdrawing ? "Processing..." : "Claim All Funds"}
               </Button>
             </div>
          )}

          {progress < 100 && !canceled && <CancelGoalButton goalId={id} />}

          <div className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
            <div className="mb-4 flex items-center gap-2">
              <History className="h-5 w-5" />
              <h2 className="font-pixel text-sm leading-6">History</h2>
            </div>
            <div className="space-y-3">
              {goalHistory.length > 0 ? (
                goalHistory.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-bold">{item.label}</p>
                    <div className="flex items-center justify-between text-xs text-ink/60">
                      <span>{formatDate(item.createdAt)}</span>
                      {item.amount !== undefined && (
                        <span className="font-bold text-ink">
                          +{item.amount} mUSDC
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-bold text-ink/50">No recent activity history.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
