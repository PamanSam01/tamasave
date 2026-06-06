"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Fingerprint, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  isValidRitualUsername,
  normalizeUsername,
  storeIdentity
} from "@/lib/identity";
import { RitualIdentity } from "@/lib/types";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ritualIdentityRegistryAddress, ritualIdentityRegistryAbi } from "@/lib/contracts";
import { useEffect } from "react";

export function ClaimUsernameModal({
  open,
  onOpenChange,
  onMinted
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMinted: (identity: RitualIdentity) => void;
}) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);

  const { address } = useAccount();

  const username = useMemo(() => normalizeUsername(value), [value]);
  const valid = isValidRitualUsername(username);

  const { data: isAvailableOnchain, isFetching: isChecking, error, isError } = useReadContract({
    address: ritualIdentityRegistryAddress,
    abi: ritualIdentityRegistryAbi,
    functionName: "isAvailable",
    args: [username],
    query: { enabled: checked && valid } // Fetch when checked and valid
  });

  const available = checked && !isChecking && !isError && !!isAvailableOnchain;

  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const minting = isWritePending || isConfirming;

  useEffect(() => {
    if (isConfirmed && address) {
      const identity: RitualIdentity = {
        username: username as `${string}.ritual`,
        memberSince: new Date().toISOString(),
        walletAddress: address
      };
      storeIdentity(identity);
      onMinted(identity);
      onOpenChange(false);
    }
  }, [isConfirmed, address, username, onMinted, onOpenChange]);

  if (!open) return null;

  async function checkAvailability() {
    setChecked(true);
  }

  async function mint() {
    if (!address) return; // ensure wallet connected
    writeContract({
      address: ritualIdentityRegistryAddress,
      abi: ritualIdentityRegistryAbi,
      functionName: "claimUsername",
      args: [username]
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-lg border-4 border-ink bg-card p-4 shadow-pixel">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-ink/70">Ritual Identity</p>
            <h2 className="font-pixel text-lg leading-8">Claim Username</h2>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded border-2 border-ink bg-shell font-bold"
            onClick={() => onOpenChange(false)}
            aria-label="Close claim username modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase text-ink/70">Username Input</label>
          <Input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setChecked(false);
            }}
            placeholder="alpha"
          />
          <div className="rounded border-2 border-ink bg-screen p-3">
            <p className="text-xs font-bold uppercase text-ink/70">Preview</p>
            <p className="font-pixel text-sm leading-6">{username || "name.ritual"}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold">
            {checked ? (
              isChecking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Checking availability...
                </>
              ) : available ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Available on Ritual Identity Registry
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  {isError 
                    ? "Error reading from contract (wrong network?)" 
                    : !valid 
                      ? "Pick 3-16 letters, numbers, or hyphens" 
                      : "Username is already taken"}
                </>
              )
            ) : (
              <>
                <Fingerprint className="h-5 w-5" />
                Examples: alpha.ritual, builder.ritual, satoshi.ritual
              </>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={checkAvailability} disabled={!valid || isChecking}>
              {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Check
            </Button>
            <Button type="button" onClick={mint} disabled={!available || minting}>
              {minting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
              Mint
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
