"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { WalletCards, LogOut, Network, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletConnectModal } from "@/components/wallet-connect-modal";

export function WalletConnectButton() {
  const { address, isConnected, chain, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isConnected && address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex h-10 items-center gap-2 rounded-lg border-2 border-ink bg-screen px-3 text-xs font-bold transition-colors hover:bg-mint/20 focus:outline-none"
        >
          <WalletCards className="h-4 w-4" />
          <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : "opacity-50"}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border-2 border-ink bg-card shadow-pixel-sm z-50">
            <div className="flex items-center gap-2 border-b-2 border-ink px-3 py-2 text-xs">
              <Network className={`h-4 w-4 ${chainId === 1979 ? "text-mint" : "text-red-500"}`} />
              <span className={`font-bold ${chainId === 1979 ? "text-mint" : "text-red-500"}`}>
                {chain?.name || (chainId === 1979 ? "Ritual Chain" : "Unsupported Network")}
              </span>
            </div>

            {chainId !== 1979 && switchChain && (
              <button
                onClick={() => {
                  switchChain(
                    { chainId: 1979 },
                    {
                      onSuccess: () => setDropdownOpen(false),
                      onError: (error) => {
                        // console.error("Switch Chain Error:", error);
                        // console.log(`Failed to switch network: ${error.message}`);
                      }
                    }
                  );
                }}
                disabled={isSwitching}
                className="flex w-full items-center justify-between border-b-2 border-ink px-3 py-2 text-xs font-bold text-ink hover:bg-screen transition-colors disabled:opacity-50"
              >
                <span>{isSwitching ? "Switching..." : "Switch to Ritual"}</span>
                <Network className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold text-red-500 hover:bg-screen transition-colors"
            >
              <span>Disconnect</span>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setModalOpen(true)}
      >
        <WalletCards className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
      <WalletConnectModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
