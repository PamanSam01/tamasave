# TamaSave Repository Audit Report

This document outlines a brutal, repository-driven analysis of the current TamaSave codebase, identifying discrepancies between documentation and implementation, dead code, security concerns, and improvement opportunities.

## 1. Features Documented but Not Implemented
- **L402 Credits / AI Reminders**: The UI features an `ai-reminder-widget.tsx` that suggests purchasing L402 credits for AI agents. However, the purchase logic is completely stubbed out and there is no underlying smart contract or API route to handle AI integration or L402 payments.
- **Missed Save Alerts**: The settings page has a toggle for "Missed save alerts" but it is marked as "disabled" and "Coming soon". There is no logic to track or send notifications for missed saves.
- **Badges**: The Goal Detail page displays a "Badges" counter, but this is hardcoded to `0` and has no onchain or offchain tracking logic.

## 2. Features Implemented but Undocumented
- **Battery Optimization (`document.hidden`)**: The hooks `useLiveActivity.ts`, `useUserActivity.ts`, and `useGoalHistory.ts` utilize browser visibility checks to pause RPC polling. This is a highly advanced frontend optimization that prevents mobile battery drain but was not heavily emphasized in previous documentation.
- **Penalty Logic on Cancellation**: `GoalVault.sol` implements a 5% penalty when a user calls `cancelGoal()`. The penalty is sent to a `treasury` address. This economic model was not explicitly explained in the documentation.
- **Passkey Onboarding**: `lib/passkey.ts` implements a WebAuthn passkey flow, but its integration with the actual Wallet environment (whether it generates an Embedded Wallet or just signs local messages) is vaguely implemented.

## 3. Dead Code & Unused Files
- **`src/lib/ritual-scheduler.ts`**: Contains functions `buildSchedulerTask` and `createRitualSchedulerTask`. These were MVP stubs. The frontend currently writes directly to `GoalManager.createSchedule` via Wagmi, making these stub functions dead code.
- **`src/lib/identity.ts`**: Contains `storeIdentity` and `getStoredIdentity` relying on `localStorage`. However, the app fetches identity directly from the `RitualIdentityRegistry` contract via Wagmi, making the local storage caching mechanism largely redundant and unused.
- **Root `.mjs` Scripts**: `check.mjs`, `check-time.mjs`, and `check-block.mjs` appear to be leftover testing scripts used during development. They are not part of the Next.js build or Hardhat deployment process.

## 4. Improvement Opportunities
- **Decoupled Approvals**: In `goal-detail-client.tsx` and `goals/page.tsx`, the `approve` and `deposit` (or `createGoal`) transactions are executed sequentially. If the first transaction succeeds but the second fails, the UI does not gracefully recover to let the user resume from step 2.
- **Global State for Settings**: The settings state (sound, confetti) relies heavily on direct `localStorage.getItem` reads inside component render cycles or transaction handlers. Migrating this to a Context Provider or Zustand store would be cleaner.
- **Dynamic Pet Sprites**: Currently, `PetSprite` relies on static `.gif` files in `public/`. Migrating these to dynamic, onchain SVG representations would make the pets fully decentralized NFTs.

## 5. Security Concerns
- **`GoalManager.sol` Randomness**: `scheduleId` is generated using `keccak256(abi.encode(msg.sender, goalId, amount, cadenceSeconds, block.timestamp, scheduleIds.length))`. Using `block.timestamp` and array length is deterministic and predictable, which could theoretically allow schedule ID collisions or manipulation, though the risk is low for this specific use case.
- **`GoalVault.sol` Deposit Authentication**: The `deposit` function allows `msg.sender == goal.owner || msg.sender == schedulerBot`. However, `schedulerBot` is a single centralized address set by the Admin. If the bot is compromised, it can force users to deposit funds against their will (if they have active token approvals).
- **Infinite Approvals**: The frontend requests users to approve the exact `targetAmount` when creating a goal, which is safe. However, the manual deposit requests an exact `approve` for the deposit amount. This leads to UX friction (double signing). Utilizing EIP-2612 Permits would solve this securely.

## 6. Deployment Concerns
- **Strict Linting Disabled**: `next.config.ts` currently has `ignoreBuildErrors: true` for both ESLint and TypeScript. While acceptable for MVP deployment on Vercel, this is a technical debt time-bomb for a production repository.
- **Missing Deployment Scripts**: The `DEPLOYMENT.md` references `scripts/deploy.ts`, but the repository state implies deployments might have been done manually or with ad-hoc scripts that are not fully robust for multi-chain environments.
