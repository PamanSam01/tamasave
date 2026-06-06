import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-4 overflow-hidden rounded border-2 border-ink bg-shell", className)}>
      <div
        className="h-full bg-mint transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
