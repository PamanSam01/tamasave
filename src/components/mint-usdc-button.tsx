"use client";

import { useState, useEffect } from "react";
import { Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWriteContract, useAccount, useReadContract } from "wagmi";

export const MOCK_USDC_ADDRESS = "0x1E9e15b17DA7cf901D2Ada5718ef5cdfB0b9f543" as const;

const mockUsdcAbi = [
  {
    type: "function",
    name: "faucet",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  {
    type: "function",
    name: "lastMintTime",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;

export function MintUsdcButton() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { data: lastMintTime, refetch } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: mockUsdcAbi,
    functionName: "lastMintTime",
    args: [address as `0x${string}`],
    query: { enabled: !!address, refetchInterval: 10000 }
  });

  useEffect(() => {
    if (!lastMintTime) {
      setTimeLeft(null);
      return;
    }

    const checkCooldown = () => {
      const now = Date.now();
      const last = Number(lastMintTime);
      const cooldown = 86400000; // 24 hours in ms
      
      if (last > 0 && now < last + cooldown) {
        setTimeLeft((last + cooldown) - now);
      } else {
        setTimeLeft(null);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [lastMintTime]);

  const handleMint = async () => {
    if (timeLeft) return;

    setIsLoading(true);
    try {
      await writeContractAsync({
        address: MOCK_USDC_ADDRESS,
        abi: mockUsdcAbi,
        functionName: "faucet",
      });
      
      const currentSettings = JSON.parse(localStorage.getItem("tamasave_settings") || "{}");
      if (currentSettings.soundEnabled !== false) {
        import("@/lib/effects").then(m => m.playPixelSound());
      }
      if (currentSettings.confettiEnabled !== false) {
        import("@/lib/effects").then(m => m.triggerConfetti());
      }

      // console.log("Mint successful! Your mUSDC balance has increased.");
      refetch();
    } catch (error: any) {
      // console.log("Mint failed:", error.message);
      if (error.message?.includes("User rejected") || error.message?.includes("rejected the request")) {
        // User intentionally cancelled, no need for scary alert
      } else if (error.message?.includes("24 jam")) {
        // console.log("Failed: You have already minted within the last 24 hours. Please wait!");
      } else {
        // console.log("Failed to mint: " + (error.shortMessage || error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (timeLeft && timeLeft > 0) {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return (
      <Button 
        size="sm" 
        variant="outline" 
        disabled
        className="border-ink/20 bg-shell text-ink/50 px-2 sm:px-3"
      >
        <Droplet className="h-4 w-4 opacity-50 sm:mr-2" />
        <span className="hidden sm:inline">{hours}h {mins}m left</span>
      </Button>
    );
  }

  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={handleMint}
      disabled={isLoading}
      className="border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 px-2 sm:px-3"
      title="Dapatkan 100 mUSDC gratis untuk testing"
    >
      <Droplet className="h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">{isLoading ? "Minting..." : "Mint mUSDC"}</span>
    </Button>
  );
}
