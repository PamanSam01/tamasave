"use client";

import { useState, useEffect } from "react";
import { Camera, Save, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useRitualIdentity } from "@/hooks/use-ritual-identity";
import { useWriteContract } from "wagmi";
import { ritualIdentityRegistryAbi, ritualIdentityRegistryAddress } from "@/lib/contracts";

export function EditProfileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const identity = useRitualIdentity();
  const [username, setUsername] = useState("");
  const [pfp, setPfp] = useState("");
  const [xUsername, setXUsername] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const onchainUsername = identity?.username;
  const onchainPfp = identity?.pfp;
  const onchainX = identity?.xUsername;
  const onchainDiscord = identity?.discordUsername;

  // Initialize from identity only when opened or when onchain data changes
  useEffect(() => {
    if (open) {
      setUsername(onchainUsername?.replace(".ritual", "") || "");
      setPfp(onchainPfp || "");
      setXUsername(onchainX || "");
      setDiscordUsername(onchainDiscord || "");
    }
  }, [open, onchainUsername, onchainPfp, onchainX, onchainDiscord]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const profileData = JSON.stringify({ image: pfp, x: xUsername, discord: discordUsername });
      await writeContractAsync({
        address: ritualIdentityRegistryAddress,
        abi: ritualIdentityRegistryAbi,
        functionName: "updateProfile",
        args: [`${username}.ritual`, profileData]
      });
      // console.log("Profile updated successfully onchain!");
      onOpenChange(false);
      // Wait for block to mine to see changes, or reload
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      // console.error(error);
      // console.log("Failed to update profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border-2 border-ink bg-card p-6 shadow-pixel-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="font-pixel text-xl">Edit Profile</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded hover:bg-ink/10 p-1">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <label className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-screen hover:bg-ink/5 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement("canvas");
                          const ctx = canvas.getContext("2d");
                          
                          const MAX_SIZE = 120;
                          let width = img.width;
                          let height = img.height;
                          
                          if (width > height) {
                            if (width > MAX_SIZE) {
                              height *= MAX_SIZE / width;
                              width = MAX_SIZE;
                            }
                          } else {
                            if (height > MAX_SIZE) {
                              width *= MAX_SIZE / height;
                              height = MAX_SIZE;
                            }
                          }
                          
                          canvas.width = width;
                          canvas.height = height;
                          ctx?.drawImage(img, 0, 0, width, height);
                          
                          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
                          setPfp(compressedBase64);
                        };
                        img.src = reader.result as string;
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {pfp ? (
                  <img src={pfp} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-ink/30" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <span className="text-xs font-bold text-white">Upload</span>
                </div>
              </label>
              <p className="text-xs font-bold uppercase text-ink/70">Click avatar to upload</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-ink/70">Username</label>
              <div className="flex w-full items-center overflow-hidden rounded border-2 border-ink bg-shell focus-within:ring-2 focus-within:ring-ink">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="sam"
                  className="flex-1 bg-transparent px-3 py-2 font-pixel text-lg outline-none"
                />
                <span className="border-l-2 border-ink bg-ink/5 px-3 py-2 font-pixel text-lg text-ink/60">
                  .ritual
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-ink/50">Note: Updating onchain ENS/Ritual names will require a transaction.</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-ink/70">X (Twitter) Username</label>
              <div className="flex w-full items-center overflow-hidden rounded border-2 border-ink bg-shell focus-within:ring-2 focus-within:ring-ink">
                <span className="border-r-2 border-ink bg-ink/5 px-3 py-2 font-pixel text-lg text-ink/60">
                  @
                </span>
                <input
                  type="text"
                  value={xUsername}
                  onChange={(e) => setXUsername(e.target.value)}
                  placeholder="elonmusk"
                  className="flex-1 bg-transparent px-3 py-2 font-pixel text-lg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-ink/70">Discord Username</label>
              <div className="flex w-full items-center overflow-hidden rounded border-2 border-ink bg-shell focus-within:ring-2 focus-within:ring-ink">
                <span className="border-r-2 border-ink bg-ink/5 px-3 py-2 font-pixel text-lg text-ink/60">
                  #
                </span>
                <input
                  type="text"
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  placeholder="wumpus"
                  className="flex-1 bg-transparent px-3 py-2 font-pixel text-lg outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" className="font-bold">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleSave} disabled={isSaving} className="font-bold">
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
