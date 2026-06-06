"use client";

import { Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useSettings } from "@/hooks/use-settings";
import { playPixelSound, triggerConfetti } from "@/lib/effects";

export default function SettingsPage() {
  const { settings, updateSetting } = useSettings();

  return (
    <AppShell>
      <div className="grid gap-4 max-w-2xl">
        <section className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
          <div className="mb-4 flex items-center gap-3">
            <Volume2 className="h-6 w-6" />
            <h2 className="font-pixel text-sm leading-6">Pet Care</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded border-2 border-ink bg-shell p-3 font-bold cursor-pointer">
              Pixel sound effects
              <input 
                type="checkbox" 
                checked={settings.soundEnabled} 
                onChange={(e) => {
                  updateSetting("soundEnabled", e.target.checked);
                  if (e.target.checked) playPixelSound();
                }}
                className="h-5 w-5 accent-[#9bdba8] cursor-pointer" 
              />
            </label>
            <label className="flex items-center justify-between rounded border-2 border-ink bg-shell p-3 font-bold cursor-pointer">
              Evolution confetti
              <input 
                type="checkbox" 
                checked={settings.confettiEnabled} 
                onChange={(e) => {
                  updateSetting("confettiEnabled", e.target.checked);
                  if (e.target.checked) triggerConfetti();
                }}
                className="h-5 w-5 accent-[#9bdba8] cursor-pointer" 
              />
            </label>
            <label className="flex items-center justify-between rounded border-2 border-ink bg-shell p-3 font-bold cursor-pointer text-ink/50">
              Missed save alerts (Coming soon)
              <input 
                type="checkbox" 
                checked={settings.alertsEnabled} 
                onChange={(e) => updateSetting("alertsEnabled", e.target.checked)}
                className="h-5 w-5 accent-[#9bdba8] cursor-pointer" 
                disabled
              />
            </label>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
