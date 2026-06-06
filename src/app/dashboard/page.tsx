"use client";

import { Flame, PiggyBank, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GoalCard } from "@/components/goal-card";
import { StatTile } from "@/components/stat-tile";
import { SchedulerPanel } from "@/components/scheduler-panel";
import { DashboardIdentitySection } from "@/components/dashboard-identity-section";
import { QuickTransferWidget } from "@/components/quick-transfer-widget";
import { LiveFeedTicker } from "@/components/live-feed-ticker";
import { formatCurrency } from "@/lib/utils";
import { useOnchainGoals } from "@/hooks/use-onchain-goals";
import { useAccount } from "wagmi";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { goals, totalSaved, activeGoals, longestStreak, isLoading } = useOnchainGoals();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <AppShell>
        <div className="space-y-5">
          <section className="rounded-lg border-2 border-ink bg-screen p-5 shadow-pixel-sm">
            <p className="text-xs font-bold uppercase text-ink/70">Welcome back</p>
            <h1 className="mt-2 font-pixel text-2xl leading-10">Please Connect Wallet</h1>
            <p className="mt-2 max-w-2xl font-bold text-ink/75">
              Connect your wallet to view your onchain pets and dashboard.
            </p>
          </section>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-lg border-2 border-ink bg-screen p-5 shadow-pixel-sm">
          <p className="text-xs font-bold uppercase text-ink/70">Welcome back</p>
          <h1 className="mt-2 font-pixel text-2xl leading-10">Your pets are hungry</h1>
          <p className="mt-2 max-w-2xl font-bold text-ink/75">
            Ritual Scheduler keeps every goal moving, even when you do not open the app.
          </p>
        </section>
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <StatTile label="Total Saved" value={isLoading ? "..." : formatCurrency(totalSaved)} icon={PiggyBank} tone="bg-mint" />
          <StatTile label="Active Goals" value={isLoading ? "..." : `${activeGoals}`} icon={Target} tone="bg-peach" />
          <StatTile label="Longest Streak" value={isLoading ? "..." : `${longestStreak}x`} icon={Flame} tone="bg-sky" />
        </section>
        <DashboardIdentitySection />
        <QuickTransferWidget />
      </div>
    </AppShell>
  );
}
