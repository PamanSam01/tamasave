import { GoalStage } from "@/lib/types";
import { clamp } from "@/lib/utils";

export function getProgress(saved: number, target: number) {
  if (target <= 0) return 0;
  return clamp(Math.round((saved / target) * 100));
}

export function getPetStage(progress: number): GoalStage {
  if (progress <= 0) return "Egg";
  if (progress < 25) return "Baby";
  if (progress < 50) return "Teen";
  if (progress < 75) return "Adult";
  return "Legendary";
}

export const stageCopy: Record<GoalStage, string> = {
  Egg: "Waiting for the first snack",
  Baby: "Tiny saver, huge dreams",
  Teen: "Learning to budget",
  Adult: "Strong saving habits",
  Legendary: "Future fully fed"
};

export const petSprites: Record<GoalStage, string[]> = {
  Egg: ["  ████  ", " █░░░█ ", "█░░░░░█", "█░░░░░█", " █▄▄▄█ "],
  Baby: [" ▄██▄ ", "█^  ^█", "█  ▽ █", " ▀██▀ ", "  ██  "],
  Teen: [" ▄████▄ ", "█ o  o █", "█  ▽  █", " ▀████▀ ", "  ▄██▄  "],
  Adult: ["▄██████▄", "█ ●  ● █", "█  ◡   █", "████████", " ▀ ██ ▀ "],
  Legendary: ["✦▄████▄✦", "█ ◆  ◆ █", "█  ♥   █", "████████", "✦▀ ██ ▀✦"]
};
