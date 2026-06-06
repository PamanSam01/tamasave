export type GoalStage = "Egg" | "Baby" | "Teen" | "Adult" | "Legendary";

export type ActivityType = "success" | "missed" | "completed" | "created" | "evolved";

export type Goal = {
  id: string;
  ownerUsername: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  token: "USDC" | "ETH" | "RITUAL";
  autoSaveAmount: number;
  frequency: "daily" | "weekly" | "monthly";
  nextSaveAt: string;
  streak: number;
  scheduleId: string;
  status: "active" | "paused" | "completed";
  petName: string;
  color: "mint" | "peach" | "sky" | "candy" | "lilac";
  history: GoalHistory[];
};

export type GoalHistory = {
  id: string;
  type: ActivityType;
  label: string;
  amount?: number;
  createdAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  icon: string;
};

export type SchedulerTaskPayload = {
  taskId: string;
  goalId: string;
  cadence: string;
  token: string;
  amount: number;
  vaultAddress: `0x${string}`;
  enabled: boolean;
};

export type RitualIdentity = {
  username: `${string}.ritual`;
  pfp?: string;
  memberSince: string;
  walletAddress: string;
};
