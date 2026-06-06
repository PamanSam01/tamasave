import { Achievement, Goal, GoalHistory } from "@/lib/types";

export const goals: Goal[] = [
  {
    id: "steam-deck",
    ownerUsername: "alpha.ritual",
    name: "Steam Deck",
    targetAmount: 500,
    savedAmount: 185,
    token: "USDC",
    autoSaveAmount: 10,
    frequency: "weekly",
    nextSaveAt: "2026-06-08T09:00:00.000Z",
    streak: 7,
    scheduleId: "ritual_sched_steam_7d",
    status: "active",
    petName: "Pixel",
    color: "mint",
    history: [
      {
        id: "h1",
        type: "success",
        label: "Ritual Scheduler fed Pixel",
        amount: 10,
        createdAt: "2026-06-01T09:00:00.000Z"
      },
      {
        id: "h2",
        type: "evolved",
        label: "Pixel evolved into Teen",
        createdAt: "2026-05-25T09:00:00.000Z"
      },
      {
        id: "h3",
        type: "success",
        label: "Weekly auto-save executed",
        amount: 10,
        createdAt: "2026-05-25T09:00:00.000Z"
      }
    ]
  },
  {
    id: "bali-vacation",
    ownerUsername: "alpha.ritual",
    name: "Bali Vacation",
    targetAmount: 1200,
    savedAmount: 930,
    token: "USDC",
    autoSaveAmount: 50,
    frequency: "weekly",
    nextSaveAt: "2026-06-09T02:00:00.000Z",
    streak: 12,
    scheduleId: "ritual_sched_bali_7d",
    status: "active",
    petName: "Mochi",
    color: "peach",
    history: [
      {
        id: "h4",
        type: "success",
        label: "Weekly beach-fund snack",
        amount: 50,
        createdAt: "2026-06-02T02:00:00.000Z"
      },
      {
        id: "h5",
        type: "evolved",
        label: "Mochi reached Legendary form",
        createdAt: "2026-05-26T02:00:00.000Z"
      }
    ]
  },
  {
    id: "emergency-fund",
    ownerUsername: "builder.ritual",
    name: "Emergency Fund",
    targetAmount: 2000,
    savedAmount: 460,
    token: "USDC",
    autoSaveAmount: 25,
    frequency: "weekly",
    nextSaveAt: "2026-06-10T14:00:00.000Z",
    streak: 4,
    scheduleId: "ritual_sched_emergency_7d",
    status: "active",
    petName: "Bento",
    color: "sky",
    history: [
      {
        id: "h6",
        type: "missed",
        label: "Wallet balance too low for scheduled feed",
        amount: 25,
        createdAt: "2026-06-03T14:00:00.000Z"
      },
      {
        id: "h7",
        type: "success",
        label: "Manual catch-up deposit",
        amount: 50,
        createdAt: "2026-06-03T16:00:00.000Z"
      }
    ]
  },
  {
    id: "new-laptop",
    ownerUsername: "satoshi.ritual",
    name: "New Laptop",
    targetAmount: 1800,
    savedAmount: 0,
    token: "USDC",
    autoSaveAmount: 30,
    frequency: "weekly",
    nextSaveAt: "2026-06-11T10:00:00.000Z",
    streak: 0,
    scheduleId: "ritual_sched_laptop_7d",
    status: "paused",
    petName: "Dot",
    color: "lilac",
    history: [
      {
        id: "h8",
        type: "created",
        label: "Goal created, schedule awaiting first run",
        createdAt: "2026-06-04T10:00:00.000Z"
      }
    ]
  }
];

export const activity: GoalHistory[] = goals
  .flatMap((goal) => goal.history.map((item) => ({ ...item, label: `${goal.name}: ${item.label}` })))
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const achievements: Achievement[] = [
  {
    id: "first-save",
    title: "First Save",
    description: "Complete your first scheduled deposit.",
    unlocked: true,
    progress: 100,
    icon: "★"
  },
  {
    id: "seven-day-streak",
    title: "7 Day Streak",
    description: "Keep a pet fed for seven scheduled saves.",
    unlocked: true,
    progress: 100,
    icon: "7"
  },
  {
    id: "hundred-usdc",
    title: "100 USDC Saved",
    description: "Save 100 USDC across all goal vaults.",
    unlocked: true,
    progress: 100,
    icon: "$"
  },
  {
    id: "goal-completed",
    title: "Goal Completed",
    description: "Fully fund a goal and unlock withdrawal.",
    unlocked: false,
    progress: 78,
    icon: "✓"
  }
];
