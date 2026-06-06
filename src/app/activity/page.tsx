"use client";

import { AlertTriangle, CheckCircle2, Flag, Sparkles, Activity } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useUserActivity } from "@/hooks/use-user-activity";
import { useAccount } from "wagmi";

const typeToIcon = (type?: string) => {
  if (type === 'identity') return Sparkles;
  if (type === 'create') return Sparkles;
  if (type === 'deposit') return CheckCircle2;
  if (type === 'withdraw') return Flag;
  if (type === 'cancel') return AlertTriangle;
  return Activity;
};

export default function ActivityPage() {
  const { address } = useAccount();
  const { activities, isLoading } = useUserActivity(address);

  return (
    <AppShell>
      <section className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
        <h1 className="font-pixel text-xl leading-9">Personal Activity Log</h1>
        <p className="mb-4 mt-1 font-bold text-ink/70">A complete history of all your transactions and activities.</p>
        
        {isLoading ? (
          <div className="flex h-32 items-center justify-center font-bold text-ink/50">
            Scanning Ritual Testnet...
          </div>
        ) : activities.length === 0 ? (
          <div className="flex h-32 items-center justify-center font-bold text-ink/50">
            No onchain activity yet.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((item) => {
              const Icon = typeToIcon(item.type);
              return (
                <div key={item.id} className="flex gap-3 rounded-lg border-2 border-ink bg-shell p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-ink bg-screen">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap justify-between gap-2">
                      <p className="font-bold">{item.label}</p>
                      <span className="text-xs font-bold text-ink/70">{formatDate(item.createdAt)}</span>
                    </div>
                    {item.amount !== undefined ? <p className="text-sm font-bold text-ink/70">+{item.amount} mUSDC</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
