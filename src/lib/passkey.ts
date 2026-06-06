"use client";

export async function signInWithPasskey() {
  if (!("credentials" in navigator)) {
    throw new Error("Passkeys are not supported in this browser.");
  }

  await new Promise((resolve) => setTimeout(resolve, 450));
  return {
    id: "demo-passkey-session",
    address: "0xPasskeyRitualWallet"
  };
}
