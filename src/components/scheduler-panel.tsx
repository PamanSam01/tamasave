import { CalendarClock, CheckCircle2, Repeat, ShieldCheck, Zap } from "lucide-react";
import { Goal } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function SchedulerPanel({ goal }: { goal: Goal }) {
  return (
    <div className="rounded-lg border-2 border-ink bg-screen p-4 shadow-pixel-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded border-2 border-ink bg-butter">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-pixel text-sm leading-6">Ritual Scheduler</h3>
          <p className="text-xs font-bold text-ink/70">{goal.scheduleId}</p>
        </div>
      </div>
      <div className="grid gap-2 grid-cols-1">
        <div className="rounded border-2 border-ink bg-shell p-3">
          <Repeat className="mb-2 h-5 w-5" />
          <p className="text-xs font-bold uppercase text-ink/70">Cadence</p>
          <p className="font-bold capitalize">{goal.frequency}</p>
        </div>
        <div className="rounded border-2 border-ink bg-shell p-3">
          <CalendarClock className="mb-2 h-5 w-5" />
          <p className="text-xs font-bold uppercase text-ink/70">Next Save</p>
          <p className="font-bold">{formatDate(goal.nextSaveAt)}</p>
        </div>

        <div className="rounded border-2 border-ink bg-shell p-3">
          <CheckCircle2 className="mb-2 h-5 w-5" />
          <p className="text-xs font-bold uppercase text-ink/70">Amount</p>
          <p className="font-bold">{formatCurrency(goal.autoSaveAmount, goal.token)}</p>
        </div>
      </div>
    </div>
  );
}
