"use client";

import { useState } from "react";

import { ClaimUsernameModal } from "@/components/claim-username-modal";
import { IdentityBanner } from "@/components/identity-banner";
import { IdentityCard } from "@/components/identity-card";

export function DashboardIdentitySection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IdentityBanner onClaim={() => setOpen(true)} />
      <IdentityCard onClaim={() => setOpen(true)} />
      <ClaimUsernameModal open={open} onOpenChange={setOpen} onMinted={() => undefined} />
    </>
  );
}
