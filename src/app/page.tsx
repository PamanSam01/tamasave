"use client";

import Link from "next/link";
import { ArrowRight, Fingerprint, Gamepad2, TimerReset, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PetSprite } from "@/components/pet-sprite";
import { getPetStage } from "@/lib/pet";

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl flex-col">
        <nav className="mb-6 flex items-center justify-between rounded-lg border-2 border-ink bg-shell px-4 py-3 shadow-pixel-sm">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo home/TamaSave.png" 
              alt="TamaSave Logo" 
              className="h-16 w-16 object-contain scale-125" 
            />
            <span className="font-pixel text-sm">TamaSave</span>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" variant="outline">
              Open App
            </Button>
          </Link>
        </nav>

        <section className="grid flex-1 items-center gap-8 pb-8 lg:grid-cols-[1fr_520px]">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded border-2 border-ink bg-butter px-3 py-2 text-xs font-bold shadow-pixel-sm">
              Built on Ritual Chain
            </p>
            <h1 className="font-pixel text-4xl leading-[1.35] md:text-6xl">Feed Your Future</h1>
            <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-ink/80">
              Turn savings goals into living digital pets powered by Ritual Scheduler.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button className="h-12">
                  Create Your First Pet
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/goals">
                <Button className="h-12" variant="peach">
                  View Demo Pets
                  <Gamepad2 className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Claim Username", Fingerprint],
                ["Ritual Wallet", Wallet],
                ["Scheduler feeds", TimerReset]
              ].map(([label, Icon]) => {
                const RealIcon = Icon as typeof Fingerprint;
                return (
                  <div key={label as string} className="rounded-lg border-2 border-ink bg-card p-3 shadow-pixel-sm">
                    <RealIcon className="mb-2 h-5 w-5" />
                    <p className="text-sm font-bold">{label as string}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border-[10px] border-ink bg-peach p-5 shadow-pixel">
            <div className="rounded-lg border-4 border-ink bg-shell p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-pixel text-xs">Steam Deck</span>
                <span className="rounded border-2 border-ink bg-mint px-2 py-1 text-xs font-bold">37%</span>
              </div>
              <PetSprite stage={getPetStage(37)} color="mint" size="lg" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <span className="h-8 rounded-full border-2 border-ink bg-coral" />
                <span className="h-8 rounded-full border-2 border-ink bg-butter" />
                <span className="h-8 rounded-full border-2 border-ink bg-sky" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          <div className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
            <h2 className="font-pixel text-sm leading-6">1. Create goal</h2>
            <p className="mt-2 text-sm font-bold text-ink/75">Name a dream, choose token, target, amount, and cadence.</p>
          </div>
          <div className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
            <h2 className="font-pixel text-sm leading-6">2. Schedule feed</h2>
            <p className="mt-2 text-sm font-bold text-ink/75">Ritual Scheduler runs deposits automatically without an app session.</p>
          </div>
          <div className="rounded-lg border-2 border-ink bg-card p-4 shadow-pixel-sm">
            <h2 className="font-pixel text-sm leading-6">3. Pet evolves</h2>
            <p className="mt-2 text-sm font-bold text-ink/75">Progress becomes emotional: Egg, Baby, Teen, Adult, Legendary.</p>
          </div>
        </section>

        <footer className="mt-auto flex flex-col items-center justify-between gap-4 border-t-2 border-ink py-6 text-sm font-bold md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p className="text-ink/70">© {new Date().getFullYear()} TamaSave. Built on Ritual.</p>
            <p className="text-xs text-ink/50">Built by 0xPamanSam</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://docs.ritual.net" target="_blank" rel="noreferrer" className="hover:text-mint transition-colors">
              Docs
            </a>
            <a href="https://twitter.com/ritualnet" target="_blank" rel="noreferrer" className="hover:text-mint transition-colors">
              X (Twitter)
            </a>
            <a href="https://github.com/ritual-foundation" target="_blank" rel="noreferrer" className="hover:text-mint transition-colors">
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
