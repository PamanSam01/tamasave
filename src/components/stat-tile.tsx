import { LucideIcon } from "lucide-react";

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "bg-card"
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <div className={`rounded-lg border-2 border-ink ${tone} p-4 shadow-pixel-sm`}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded border-2 border-ink bg-shell">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-ink/70">{label}</p>
      <p className="mt-1 font-pixel text-lg leading-8">{value}</p>
    </div>
  );
}
