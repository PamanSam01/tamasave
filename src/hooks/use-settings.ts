"use client";

import { useState, useEffect } from "react";

export type Settings = {
  soundEnabled: boolean;
  confettiEnabled: boolean;
  alertsEnabled: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  confettiEnabled: true,
  alertsEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("tamasave_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const updateSetting = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("tamasave_settings", JSON.stringify(newSettings));
  };

  return { settings, updateSetting };
}
