"use client";

import { WalletCards, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnect } from "wagmi";

const getWalletLogo = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("metamask")) return "/logo wallet/metamask.png";
  if (n.includes("okx")) return "/logo wallet/okx.png";
  if (n.includes("rabby")) return "/logo wallet/rabby.png";
  return null;
};

export function WalletConnectModal({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { connectors, connect, isPending } = useConnect();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4 py-6">
      <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-lg border-4 border-ink bg-card p-4 shadow-pixel">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-ink/70">Connect</p>
            <h2 className="font-pixel text-lg leading-8">Select Wallet</h2>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded border-2 border-ink bg-shell font-bold"
            onClick={() => onOpenChange(false)}
            aria-label="Close connect modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {connectors
            .filter((c) => c.name !== "Injected" && c.name !== "WalletConnect")
            .map((connector) => {
              const logo = getWalletLogo(connector.name);
              return (
                <Button
                  key={connector.uid}
                  className="w-full justify-start text-left"
                  variant="outline"
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                >
                  {logo ? (
                    <img src={logo} alt={connector.name} className="mr-3 h-5 w-5 object-contain" />
                  ) : (
                    <WalletCards className="mr-3 h-5 w-5" />
                  )}
                  {connector.name}
                  {isPending && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
                </Button>
              );
            })}
          {connectors.length === 0 && (
            <div className="rounded border-2 border-ink bg-screen p-3 text-xs font-bold text-ink/70">
              No wallets found. Please install MetaMask, Rabby, or OKX wallet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
