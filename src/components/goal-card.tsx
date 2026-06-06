import Link from "next/link";
import { CalendarClock, Flame, PauseCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PetSprite } from "@/components/pet-sprite";
import { Goal } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getPetStage, getProgress, stageCopy } from "@/lib/pet";

export function GoalCard({ goal }: { goal: Goal }) {
  const progress = getProgress(goal.savedAmount, goal.targetAmount);
  const stage = getPetStage(progress);

  return (
    <Link href={`/goals/${goal.id}`} className="block">
      <Card className="h-full transition hover:-translate-y-1 hover:shadow-pixel">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="truncate">{goal.name}</CardTitle>
              <p className="text-sm font-bold text-ink/70">
                {goal.petName} · {stage}
              </p>
              <p className="mt-1 text-xs font-bold text-ink/70">Owner: {goal.ownerUsername}</p>
            </div>
            {goal.status === "paused" ? <PauseCircle className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PetSprite stage={stage} color={goal.color} size="sm" />
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>{formatCurrency(goal.savedAmount, goal.token)}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
            <p className="text-xs font-bold text-ink/70">{stageCopy[stage]}</p>
          </div>
          <div className="flex items-center gap-2 rounded border-2 border-ink bg-shell p-2 text-xs font-bold">
            <CalendarClock className="h-4 w-4" />
            {goal.status === "paused" ? "Schedule paused" : `Next feed ${formatDate(goal.nextSaveAt)}`}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
