"use client";

import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRitualIdentity } from "@/hooks/use-ritual-identity";

export function IdentityBanner({ onClaim }: { onClaim: () => void }) {
  const identity = useRitualIdentity();
  if (identity) return null;

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-ink bg-butter p-4 shadow-pixel-sm">
      <div>
        <p className="font-pixel text-sm leading-6">Claim your Ritual Identity</p>
        <p className="mt-1 text-sm font-bold text-ink/75">Mint a username that follows your pets, vaults, and achievements.</p>
      </div>
      <Button variant="peach" onClick={onClaim}>
        <Fingerprint className="h-4 w-4" />
        Claim Username
      </Button>
    </section>
  );
}
