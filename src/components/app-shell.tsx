"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Fingerprint, Gamepad2, Home, ListChecks, Settings, Coins, Leaf, Lock, Network, Droplet } from "lucide-react";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { ClaimUsernameModal } from "@/components/claim-username-modal";
import { Button } from "@/components/ui/button";
import { useRitualIdentity } from "@/hooks/use-ritual-identity";
import { cn } from "@/lib/utils";
import { SchedulerPanel } from "@/components/scheduler-panel";
import { LiveFeedTicker } from "@/components/live-feed-ticker";
import { AiReminderWidget } from "@/components/ai-reminder-widget";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { MintUsdcButton, MOCK_USDC_ADDRESS } from "@/components/mint-usdc-button";
import { goals } from "@/lib/seed-data";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/goals", label: "Goals", icon: Gamepad2 },
  { href: "/activity", label: "Log", icon: ListChecks },
  { href: "/achievements", label: "Badges", icon: Award, locked: true },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const identity = useRitualIdentity();
  const [claimOpen, setClaimOpen] = useState(false);
  
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: usdcBalance } = useBalance({ address, token: MOCK_USDC_ADDRESS, query: { refetchInterval: 10000 } });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pt-4 pb-24 md:px-6 md:py-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-ink bg-shell px-4 py-3 shadow-pixel-sm">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logo home/TamaSave.png" 
            alt="TamaSave Logo" 
            className="h-16 w-16 object-contain scale-125" 
          />
          <span>
            <span className="block font-pixel text-sm">TamaSave</span>
            <span className="text-xs font-bold text-ink/70">Ritual Scheduler pets</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {address && (
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 rounded-lg border-2 border-ink bg-shell px-3 py-1.5 text-xs font-bold shadow-pixel-sm">
              {identity && (
                <>
                  <Fingerprint className="h-4 w-4" />
                  <span>{identity.username}</span>
                  <div className="mx-1 h-4 w-px bg-ink/30" />
                </>
              )}
              
              <Coins className="h-4 w-4" />
              <span>{balance ? `${Number(balance.formatted).toFixed(4)} RITUAL` : "0.0000 RITUAL"}</span>
              
              <div className="mx-1 h-4 w-px bg-ink/30" />
              <Droplet className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">
                {usdcBalance 
                  ? `${Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(Number(usdcBalance.formatted))} mUSDC` 
                  : "0.00 mUSDC"}
              </span>

              {identity && (
                <>
                  <div className="mx-1 h-4 w-px bg-ink/30" />
                  <Leaf className="h-4 w-4 text-ink/50" />
                  <span className="flex items-center gap-1 text-ink/50">
                    Seed <Lock className="h-3 w-3" />
                  </span>
                </>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {!identity && address && (
              <Button size="sm" variant="peach" onClick={() => setClaimOpen(true)} className="px-2 sm:px-3">
                <Fingerprint className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Claim Username</span>
              </Button>
            )}
            {address && <MintUsdcButton />}
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {pathname === "/dashboard" && (
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-pixel text-lg">Live Activity Feed</h2>
          </div>
          <LiveFeedTicker />
        </div>
      )}

      <div className="grid flex-1 gap-4 md:grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-4">
          <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-lg border-2 border-ink bg-card p-2 shadow-pixel-sm md:static md:h-fit">
            <div className="grid grid-cols-5 gap-2 md:grid-cols-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                if (item.locked) {
                  return (
                    <div
                      key={item.href}
                      className="flex h-14 cursor-not-allowed items-center justify-center gap-2 rounded border-2 border-transparent bg-ink/5 text-xs font-bold text-ink/40 transition md:justify-between md:px-3"
                      title={`${item.label} (Coming Soon)`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <span className="hidden md:inline">{item.label}</span>
                      </div>
                      <Lock className="hidden h-4 w-4 md:block" />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-14 items-center justify-center gap-2 rounded border-2 border-transparent text-xs font-bold transition md:justify-start md:px-3",
                      active ? "border-ink bg-mint shadow-pixel-sm" : "hover:bg-screen"
                    )}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {pathname === "/dashboard" && (
            <div className="hidden md:block">
              <AiReminderWidget />
            </div>
          )}
        </div>
        <main className="min-w-0">{children}</main>
      </div>
      
      <ClaimUsernameModal open={claimOpen} onOpenChange={setClaimOpen} onMinted={() => undefined} />
    </div>
  );
}
