"use client";

import { useState, useEffect } from "react";
import { Send, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { usePublicClient, useWriteContract, useAccount, useSendTransaction } from "wagmi";
import { keccak256, toBytes, parseUnits, erc20Abi } from "viem";
import { Button } from "@/components/ui/button";
import { MOCK_USDC_ADDRESS } from "@/components/mint-usdc-button";
import { ritualIdentityRegistryAddress, ritualIdentityRegistryAbi } from "@/lib/contracts";

export function QuickTransferWidget() {
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<"USDC" | "RITUAL">("USDC");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  // Live Auto-Resolution
  useEffect(() => {
    if (!username || !publicClient) {
      setResolvedAddress(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsResolving(true);
        // Auto-append .ritual if user forgets it
        const searchName = username.endsWith(".ritual") ? username : `${username}.ritual`;
        
        if (searchName.length < 10) {
          setResolvedAddress(null);
          return;
        }

        const labelHash = keccak256(toBytes(searchName));
        const owner = await publicClient.readContract({
          address: ritualIdentityRegistryAddress,
          abi: ritualIdentityRegistryAbi,
          functionName: "ownerOfUsername",
          args: [labelHash]
        }) as `0x${string}`;

        if (owner && owner !== "0x0000000000000000000000000000000000000000") {
          setResolvedAddress(owner);
        } else {
          setResolvedAddress(null);
        }
      } catch (err) {
        setResolvedAddress(null);
      } finally {
        setIsResolving(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, publicClient]);

  const handleTransfer = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!username || !amount) {
      setErrorMsg("Please enter username and amount");
      return;
    }

    if (!resolvedAddress) {
      setErrorMsg("Username not found. Make sure it is registered.");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMsg("Invalid amount");
      return;
    }

    try {
      setIsSending(true);

      const amountWei = parseUnits(amount, 18);
      const searchName = username.endsWith(".ritual") ? username : `${username}.ritual`;
      
      if (token === "USDC") {
        await writeContractAsync({
          address: MOCK_USDC_ADDRESS,
          abi: erc20Abi,
          functionName: "transfer",
          args: [resolvedAddress as `0x${string}`, amountWei]
        });
      } else {
        await sendTransactionAsync({
          to: resolvedAddress as `0x${string}`,
          value: amountWei
        });
      }

      setSuccessMsg(`Sent ${amount} ${token} to ${searchName}!`);
      setUsername("");
      setAmount("");
      setResolvedAddress(null);

    } catch (err: any) {
      // console.error(err);
      setErrorMsg(err.message || "Transfer failed");
    } finally {
      setIsSending(false);
    }
  };

  if (!isConnected) return null;

  return (
    <section className="mt-4 rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
      <div className="mb-3 flex items-center gap-2">
        <Send className="h-5 w-5" />
        <h2 className="font-pixel text-lg">Quick Send</h2>
      </div>
      <p className="mb-4 text-xs font-bold text-ink/70">
        Send tokens directly using a .ritual username instead of a 0x address.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="e.g. alice (auto-appends .ritual)"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
            className="w-full rounded border-2 border-ink bg-screen p-2 text-sm font-bold shadow-pixel-sm outline-none focus:ring-2 focus:ring-ink"
            disabled={isSending}
          />
          <div className="mt-1 flex h-4 items-center text-[10px] font-bold">
            {isResolving ? (
              <span className="text-ink/50 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin"/> Resolving...</span>
            ) : resolvedAddress ? (
              <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Found: {resolvedAddress.slice(0, 6)}...{resolvedAddress.slice(-4)}</span>
            ) : username && username.length > 2 ? (
              <span className="text-red-500 flex items-center gap-1"><XCircle className="h-3 w-3"/> Not found</span>
            ) : null}
          </div>
        </div>
        <div className="flex w-full items-start sm:w-48">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-l border-y-2 border-l-2 border-ink bg-screen p-2 text-sm font-bold shadow-pixel-sm outline-none focus:ring-2 focus:ring-ink"
            min="0"
            step="0.1"
            disabled={isSending}
          />
          <div className="flex items-center rounded-r border-2 border-ink bg-shell px-2 shadow-pixel-sm">
            <img 
              src={token === "USDC" ? "/token/usdc.png" : "/token/ritual.jpg"} 
              alt={token} 
              className="h-5 w-5 rounded-full object-cover" 
            />
            <select
              value={token}
              onChange={(e) => setToken(e.target.value as "USDC" | "RITUAL")}
              className="bg-transparent py-2 pl-2 pr-1 text-sm font-bold outline-none cursor-pointer"
              disabled={isSending}
            >
              <option value="USDC">USDC</option>
              <option value="RITUAL">RITUAL</option>
            </select>
          </div>
        </div>
        <div className="flex items-start">
          <Button 
            onClick={handleTransfer} 
            disabled={isSending || !resolvedAddress || !amount} 
            className="w-full font-bold sm:w-auto"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : `Send ${token}`}
          </Button>
        </div>
      </div>

      {errorMsg && <p className="mt-2 text-xs font-bold text-red-600">{errorMsg}</p>}
      {successMsg && <p className="mt-2 text-xs font-bold text-green-600">{successMsg}</p>}
    </section>
  );
}
