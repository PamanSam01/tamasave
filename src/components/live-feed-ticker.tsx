"use client";

import { useLiveActivity } from "@/hooks/use-live-activity";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

export function LiveFeedTicker() {
  const { activities, isLoading } = useLiveActivity();

  if (isLoading) {
    return (
      <div className="flex h-14 w-full items-center justify-center rounded-lg border-2 border-ink bg-shell shadow-pixel-sm">
        <Loader2 className="h-5 w-5 animate-spin text-ink/50" />
        <span className="ml-2 text-xs font-bold text-ink/50">Fetching live blocks...</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex h-14 w-full items-center justify-center rounded-lg border-2 border-ink bg-shell shadow-pixel-sm">
        <span className="text-xs font-bold text-ink/50">No recent activity found on Ritual Testnet.</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-ink bg-shell shadow-pixel-sm">
      <div className="relative flex h-14 w-full items-center overflow-hidden rounded-[6px]">
        <style>{`
          @keyframes customMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div 
          className="flex w-max items-center whitespace-nowrap" 
          style={{ animation: "customMarquee 40s linear infinite" }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {[...activities, ...activities, ...activities, ...activities].map((item, i) => (
            <div key={`${item.id}-${i}`} className="mx-4 flex h-full items-center gap-2">
              <span className="font-pixel text-xs text-ink/60">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </span>
              <span className="h-2 w-2 rounded-full bg-mint" />
              <span className="text-sm font-bold">{item.label}</span>
              {item.amount !== undefined && (
                <span className="rounded border-2 border-ink bg-butter px-2 py-0.5 text-xs font-bold shadow-pixel-sm">
                  +{item.amount} mUSDC
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
