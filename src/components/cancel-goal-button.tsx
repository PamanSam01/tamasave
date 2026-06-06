"use client";

import { useState } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useWriteContract } from "wagmi";
import { goalVaultAddress, goalVaultAbi } from "@/lib/contracts";

export function CancelGoalButton({ goalId }: { goalId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const handleCancel = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this goal? You will receive your saved funds minus a 5% penalty, which goes to the treasury. This action cannot be undone."
    );

    if (!confirmCancel) return;

    setIsLoading(true);
    try {
      await writeContractAsync({
        address: goalVaultAddress,
        abi: goalVaultAbi,
        functionName: "cancelGoal",
        args: [BigInt(goalId)]
      });
      // console.log("Dana berhasil ditarik dan peliharaan telah dihapus!");
      window.location.href = "/goals";
    } catch (error: any) {
      // console.log("Cancel failed:", error.message);
      if (error.message?.includes("User rejected") || error.message?.includes("rejected the request")) {
        // user cancelled
      } else {
        // console.log(`Failed to cancel goal: ${error?.shortMessage || error?.message || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border-2 border-red-900 bg-red-50 p-4 shadow-pixel-sm">
      <div className="mb-2 flex items-center gap-2 text-red-900">
        <AlertOctagon className="h-5 w-5" />
        <h2 className="font-pixel text-sm leading-6">Danger Zone</h2>
      </div>
      <p className="text-xs font-bold text-red-800/80">
        Need your funds back early? Cancel your goal to withdraw your saved amount minus a 5% penalty.
      </p>
      <Button 
        variant="outline" 
        className="mt-4 w-full border-2 border-red-900 bg-red-100 text-red-900 hover:bg-red-200" 
        onClick={handleCancel}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Emergency Withdraw"}
      </Button>
    </div>
  );
}
