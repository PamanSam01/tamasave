import { SchedulerTaskPayload } from "@/lib/types";
import { goalVaultAddress } from "@/lib/contracts";

const cadenceMap = {
  daily: "0 9 * * *",
  weekly: "0 9 * * MON",
  monthly: "0 9 1 * *"
};

export function buildSchedulerTask(input: {
  goalId: string;
  frequency: keyof typeof cadenceMap;
  token: string;
  amount: number;
}): SchedulerTaskPayload {
  return {
    taskId: `ritual_sched_${input.goalId}_${Date.now()}`,
    goalId: input.goalId,
    cadence: cadenceMap[input.frequency],
    token: input.token,
    amount: input.amount,
    vaultAddress: goalVaultAddress,
    enabled: true
  };
}

export async function createRitualSchedulerTask(input: {
  goalId: string;
  frequency: keyof typeof cadenceMap;
  token: string;
  amount: number;
}) {
  const payload = buildSchedulerTask(input);

  // MVP integration stub: replace with Ritual Scheduler SDK/client call.
  // The task should call GoalVault.deposit(goalId, amount) on each cadence.
  await new Promise((resolve) => setTimeout(resolve, 300));
  return payload;
}
