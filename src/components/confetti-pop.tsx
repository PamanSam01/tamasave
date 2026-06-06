"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export function ConfettiPop({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 3000);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!visible) return null;
  return <Confetti recycle={false} numberOfPieces={160} gravity={0.25} />;
}
