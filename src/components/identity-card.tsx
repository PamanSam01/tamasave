"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Fingerprint, Flame, Gamepad2, Trophy, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useRitualIdentity } from "@/hooks/use-ritual-identity";
import { useOnchainGoals } from "@/hooks/use-onchain-goals";
import { EditProfileModal } from "@/components/edit-profile-modal";

function XIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function DiscordIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
  );
}

export function IdentityCard({ onClaim }: { onClaim: () => void }) {
  const identity = useRitualIdentity();
  const { goals, longestStreak, isLoading } = useOnchainGoals();
  const [editOpen, setEditOpen] = useState(false);

  const displayUsername = identity?.username ?? "Unclaimed";
  const pfp = identity?.pfp;
  const xUsername = identity?.xUsername;
  const discordUsername = identity?.discordUsername;

  const goalsCreated = goals.length;
  const goalsCompleted = goals.filter((goal) => goal.status === "completed").length;
  const currentSavingStreak = longestStreak;

  return (
    <>
      <section className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            {pfp ? (
              <img src={pfp} alt="Profile" className="h-16 w-16 rounded-full border-2 border-ink object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-screen">
                <UserCircle className="h-8 w-8 text-ink/50" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase text-ink/70">Ritual Identity</p>
              <div className="flex items-center gap-3">
                <h2 className="font-pixel text-lg leading-8">{displayUsername}</h2>
                {xUsername && (
                  <a href={`https://x.com/${xUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-ink hover:underline">
                    <XIcon className="h-3 w-3" />
                    {xUsername}
                  </a>
                )}
                {discordUsername && (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#5865F2]">
                    <DiscordIcon className="h-4 w-4" />
                    {discordUsername}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {identity ? (
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>Edit Profile</Button>
            ) : (
              <Button size="sm" onClick={onClaim}>
                <Fingerprint className="h-4 w-4" />
                Claim
              </Button>
            )}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded border-2 border-ink bg-shell p-3">
            <CalendarDays className="mb-2 h-5 w-5" />
            <p className="text-xs font-bold uppercase text-ink/70">Member Since</p>
            <p className="font-bold">{identity ? formatDate(identity.memberSince) : "Not minted"}</p>
          </div>
          <div className="rounded border-2 border-ink bg-shell p-3">
            <Gamepad2 className="mb-2 h-5 w-5" />
            <p className="text-xs font-bold uppercase text-ink/70">Goals Created</p>
            <p className="font-pixel text-lg leading-8">{isLoading ? "..." : goalsCreated}</p>
          </div>
          <div className="rounded border-2 border-ink bg-shell p-3">
            <Trophy className="mb-2 h-5 w-5" />
            <p className="text-xs font-bold uppercase text-ink/70">Goals Completed</p>
            <p className="font-pixel text-lg leading-8">{isLoading ? "..." : goalsCompleted}</p>
          </div>
          <div className="rounded border-2 border-ink bg-shell p-3">
            <Flame className="mb-2 h-5 w-5" />
            <p className="text-xs font-bold uppercase text-ink/70">Current Saving Streak</p>
            <p className="font-pixel text-lg leading-8">{isLoading ? "..." : `${currentSavingStreak}x`}</p>
          </div>
        </div>
      </section>

      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
