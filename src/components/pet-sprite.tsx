"use client";

import { motion } from "framer-motion";
import { GoalStage } from "@/lib/types";
import { petSprites } from "@/lib/pet";
import { cn } from "@/lib/utils";

const colorClass = {
  mint: "bg-mint",
  peach: "bg-peach",
  sky: "bg-sky",
  candy: "bg-candy",
  lilac: "bg-lilac"
};

export function PetSprite({
  stage,
  color = "mint",
  size = "md"
}: {
  stage: GoalStage;
  color?: keyof typeof colorClass;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      className={cn(
        "scanlines screen-grid flex items-center justify-center rounded-lg border-2 border-ink p-4 pixel-art",
        colorClass[color],
        size === "sm" && "h-28",
        size === "md" && "h-40",
        size === "lg" && "h-64"
      )}
    >
      <pre className={cn("font-pixel leading-6 text-ink", size === "lg" ? "text-lg" : "text-xs")}>
        {petSprites[stage].join("\n")}
      </pre>
    </motion.div>
  );
}
