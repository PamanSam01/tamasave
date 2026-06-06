import { Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Progress } from "@/components/ui/progress";
import { achievements } from "@/lib/seed-data";

export default function AchievementsPage() {
  return (
    <AppShell>
      <section className="space-y-4">
        <div className="rounded-lg border-2 border-ink bg-screen p-5 shadow-pixel-sm">
          <h1 className="font-pixel text-xl leading-9">Achievements</h1>
          <p className="mt-1 font-bold text-ink/70">Cute milestones for serious savings habits.</p>
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-lg border-2 border-ink p-4 shadow-pixel-sm ${
                achievement.unlocked ? "bg-butter" : "bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded border-2 border-ink bg-shell font-pixel text-sm">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-pixel text-sm leading-6">{achievement.title}</h2>
                    {achievement.unlocked ? <Trophy className="h-4 w-4" /> : null}
                  </div>
                  <p className="mt-1 text-sm font-bold text-ink/70">{achievement.description}</p>
                  <div className="mt-3">
                    <Progress value={achievement.progress} />
                    <p className="mt-1 text-xs font-bold text-ink/70">{achievement.progress}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
