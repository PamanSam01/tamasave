"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Fingerprint, Flame, Gamepad2, Trophy, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useRitualIdentity } from "@/hooks/use-ritual-identity";
import { useOnchainGoals } from "@/hooks/use-onchain-goals";
import { EditProfileModal } from "@/components/edit-profile-modal";

export function IdentityCard({ onClaim }: { onClaim: () => void }) {
  const identity = useRitualIdentity();
  const { goals, longestStreak, isLoading } = useOnchainGoals();
  const [editOpen, setEditOpen] = useState(false);

  const displayUsername = identity?.username ?? "Unclaimed";
  const pfp = identity?.pfp;

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
              <h2 className="font-pixel text-lg leading-8">{displayUsername}</h2>
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
