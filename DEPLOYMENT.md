# Deployment Guide

## 1. Install

```bash
npm install
```

## 2. Configure

Create `.env.local`:

```bash
NEXT_PUBLIC_RITUAL_RPC_URL=https://rpc.testnet.ritual.net
NEXT_PUBLIC_RITUAL_EXPLORER_URL=https://explorer.testnet.ritual.net
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Create `.env` for contracts:

```bash
RITUAL_RPC_URL=https://rpc.testnet.ritual.net
DEPLOYER_PRIVATE_KEY=your_private_key
```

## 3. Deploy Contracts

```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network ritual
```

Update `src/lib/contracts.ts` with the deployed `GoalVault`, `GoalManager`, and `RitualIdentityRegistry` addresses.

## 4. Connect Ritual Scheduler

Replace the stub in `src/lib/ritual-scheduler.ts` with the production Ritual Scheduler client call.

The Scheduler task should:

- Run on the selected cadence.
- Execute `GoalVault.deposit(goalId, autoSaveAmount)`.
- Emit or index success, missed save, and completed events.
- Allow pause, resume, and cancel from `GoalManager`.

## 5. Connect Ritual Identity

Replace the stub in `src/lib/identity.ts` with a Wagmi write to:

```solidity
RitualIdentityRegistry.claimUsername(username)
```

Use `isAvailable(username)` for the availability checker and `identityOf(owner)` when hydrating an existing wallet session.

## 6. Deploy Frontend

```bash
npm run build
npm run start
```

For Vercel or another host, add the public env vars and deploy the Next.js app normally.

## 7. Demo Script

1. Open landing page and click `Create Your First Pet`.
2. Connect with passkey or wallet.
3. Claim `alpha.ritual` from the top-right navigation or dashboard CTA.
4. Create `Steam Deck`, target `500 USDC`, auto-save `10 USDC`, frequency `weekly`.
5. Show the generated Ritual Scheduler task.
6. Open goal detail and explain that each scheduled deposit feeds and evolves the pet.
7. Open `/profile/alpha` to show identity-owned goals, achievements, and total saved.
8. Show Activity for successful, missed, completed, and evolved events.
