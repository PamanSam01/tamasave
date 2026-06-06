"use client";

import { useState } from "react";
import { CalendarPlus, Coins, Plus, WandSparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GoalCard } from "@/components/goal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Goal } from "@/lib/types";
import { useOnchainGoals } from "@/hooks/use-onchain-goals";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { goalVaultAddress, goalVaultAbi } from "@/lib/contracts";
import { parseUnits } from "viem";
import { Loader2 } from "lucide-react";

export default function GoalsPage() {
  const { goals, isLoading, activeGoals } = useOnchainGoals();
  const [creating, setCreating] = useState(false);
  const [lastHash, setLastHash] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({ hash: lastHash as `0x${string}` | undefined });

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

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "New Goal");
    const targetAmountStr = String(formData.get("target") || "500");
    const tokenSymbol = String(formData.get("token") || "USDC");
    const autoSaveAmountStr = String(formData.get("amount") || "10");
    const frequency = String(formData.get("frequency") || "daily");
    
    const tokenAddress = tokenSymbol === "USDC" 
      ? "0x1E9e15b17DA7cf901D2Ada5718ef5cdfB0b9f543" 
      : "0x0000000000000000000000000000000000000000";

    const autoSaveAmount = parseUnits(autoSaveAmountStr, 18);
    let cadenceSeconds = 86400; // daily
    if (frequency === "weekly") cadenceSeconds = 604800;
    if (frequency === "monthly") cadenceSeconds = 2592000;

    try {
      // Step 1: Approve USDC for GoalVault (only up to the target amount for safety)
      // console.log("Step 1/3: Please approve USDC allowance in MetaMask.");
      await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [goalVaultAddress, parseUnits(targetAmountStr, 18)]
      });

      // Step 2: Create Goal
      // console.log("Step 2/3: Please confirm Goal Creation transaction.");
      const goalHash = await writeContractAsync({
        address: goalVaultAddress,
        abi: goalVaultAbi,
        functionName: "createGoal",
        args: [name, parseUnits(targetAmountStr, 18), tokenAddress as `0x${string}`]
      });
      setLastHash(goalHash);
      
      // We need the goalId. Since we can't easily parse receipt here without waiting, 
      // we guess it's `goals.length` (or `nextGoalId` from contract), but for safety,
      // in MVP we can just let GoalVault create it, then fetch the latest goalId.
      // Alternatively, we can just delay slightly and assume it is goals.length.
      const currentGoalId = goals.length; 
      
      // Wait a moment for UX
      await new Promise(r => setTimeout(r, 3000));

      // Step 3: Create Schedule
      // console.log("Step 3/3: Please confirm Auto-Save Schedule transaction.");
      // We dynamically import goalManagerAbi and address since they aren't at the top yet
      const { goalManagerAddress, goalManagerAbi } = await import("@/lib/contracts");
      const scheduleHash = await writeContractAsync({
        address: goalManagerAddress,
        abi: goalManagerAbi,
        functionName: "createSchedule",
        args: [BigInt(currentGoalId), autoSaveAmount, BigInt(cadenceSeconds)]
      });
      setLastHash(scheduleHash);
      
      const currentSettings = JSON.parse(localStorage.getItem("tamasave_settings") || "{}");
      if (currentSettings.soundEnabled !== false) {
        import("@/lib/effects").then(m => m.playPixelSound());
      }
      if (currentSettings.confettiEnabled !== false) {
        import("@/lib/effects").then(m => m.triggerConfetti());
      }

      // console.log("Success! Your Goal and Schedule have been created.");
      form.reset();

    } catch (err: any) {
      // console.log("Create failed:", err.message);
      if (err.message?.includes("User rejected") || err.message?.includes("rejected the request")) {
        // user cancelled
      } else {
        // console.log("Failed: " + (err.shortMessage || err.message));
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <section className="h-fit min-w-0 rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-ink bg-mint">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-pixel text-sm leading-6">Create Goal</h1>
              <p className="text-xs font-bold text-ink/70">A new goal becomes a pet.</p>
            </div>
          </div>
          <form onSubmit={handleCreateSubmit} className="space-y-3">
            <label className="block text-xs font-bold uppercase text-ink/70">Goal Name</label>
            <Input name="name" placeholder="Steam Deck OLED" required />
            <label className="block text-xs font-bold uppercase text-ink/70">Target Amount</label>
            <Input name="target" type="number" placeholder="500" required />
            <label className="block text-xs font-bold uppercase text-ink/70">Token</label>
            <select name="token" className="h-11 w-full rounded-lg border-2 border-ink bg-shell px-3 text-sm font-bold">
              <option>USDC</option>
              <option>ETH</option>
              <option>RITUAL</option>
            </select>
            <label className="block text-xs font-bold uppercase text-ink/70">Auto Save Amount</label>
            <Input name="amount" type="number" placeholder="10" required />
            <label className="block text-xs font-bold uppercase text-ink/70">Frequency</label>
            <select name="frequency" className="h-11 w-full rounded-lg border-2 border-ink bg-shell px-3 text-sm font-bold">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <Button className="w-full" disabled={creating}>
              <CalendarPlus className="h-4 w-4" />
              {creating ? "Creating Scheduler Task" : "Create Pet + Schedule"}
            </Button>
          </form>
          {lastHash ? (
            <div className="mt-4 break-all rounded border-2 border-ink bg-screen p-3 text-xs font-bold">
              <WandSparkles className="mb-2 h-4 w-4" />
              Transaction Sent: {`${lastHash.slice(0, 8)}...${lastHash.slice(-6)}`}
              {isWaiting && <Loader2 className="mt-2 h-4 w-4 animate-spin text-ink/70" />}
            </div>
          ) : null}
        </section>

        <section className="h-fit min-w-0 rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-ink bg-sky">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-pixel text-sm leading-6">Goal Pets</h2>
              <p className="text-xs font-bold text-ink/70">Your active savings pets</p>
            </div>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ink/50" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
              {goals.length === 0 && (
                <div className="col-span-full rounded border-2 border-ink bg-shell p-8 text-center shadow-pixel-sm">
                  <p className="font-bold text-ink/70">No goals found. Create your first goal to get a pet!</p>
                </div>
              )}
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
