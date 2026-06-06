import { notFound } from "next/navigation";
import { Award, Flame, Gamepad2, PiggyBank, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GoalCard } from "@/components/goal-card";
import { StatTile } from "@/components/stat-tile";
import { achievements, goals } from "@/lib/seed-data";
import { formatCurrency } from "@/lib/utils";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const ritualUsername = `${username}.ritual`;
  const ownedGoals = goals.filter((goal) => goal.ownerUsername === ritualUsername);

  if (ownedGoals.length === 0 && !["alpha.ritual", "builder.ritual", "satoshi.ritual"].includes(ritualUsername)) {
    notFound();
  }

  const activeGoals = ownedGoals.filter((goal) => goal.status === "active");
  const completedGoals = ownedGoals.filter((goal) => goal.status === "completed");
  const totalSaved = ownedGoals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const streak = ownedGoals.length ? Math.max(...ownedGoals.map((goal) => goal.streak)) : 0;

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-lg border-2 border-ink bg-screen p-5 shadow-pixel-sm">
          <p className="text-xs font-bold uppercase text-ink/70">Ritual Profile</p>
          <h1 className="mt-2 font-pixel text-2xl leading-10">{ritualUsername}</h1>
          <p className="mt-2 max-w-2xl font-bold text-ink/75">
            A portable savings identity for pets, vaults, achievements, and Scheduler streaks.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatTile label="Total Saved" value={formatCurrency(totalSaved)} icon={PiggyBank} tone="bg-mint" />
          <StatTile label="Active Goals" value={`${activeGoals.length}`} icon={Gamepad2} tone="bg-peach" />
          <StatTile label="Completed Goals" value={`${completedGoals.length}`} icon={Trophy} tone="bg-sky" />
          <StatTile label="Saving Streak" value={`${streak}x`} icon={Flame} tone="bg-butter" />
        </section>

        <section className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            <h2 className="font-pixel text-sm leading-6">Achievements</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="rounded border-2 border-ink bg-shell p-3">
                <p className="font-bold">{achievement.title}</p>
                <p className="text-xs font-bold text-ink/70">{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-pixel text-lg">Active Goals</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-pixel text-lg">Completed Goals</h2>
          <div className="rounded-lg border-2 border-ink bg-card p-4 text-sm font-bold shadow-pixel-sm">
            {completedGoals.length ? `${completedGoals.length} completed` : "No completed goals yet."}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
