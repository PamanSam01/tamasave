# TamaSave

TamaSave is a gamified crypto savings dApp built for the Ritual Chain. Users create savings goals, and each goal becomes a Tamagotchi-style pet that evolves as the vault fills. The core mechanic revolves around the **Ritual Scheduler**: every goal creates a scheduled onchain task that automatically saves funds via `GoalVault.deposit()` on the chosen cadence.

## 🌟 Key Features

### 1. Gamified Savings & Pet Evolution
- **Pet Evolution**: Pets evolve through stages (Egg → Baby → Teen → Adult → Legendary) as users deposit funds and reach their savings milestones.
- **Pixel Art UI**: A nostalgic, game-inspired interface featuring retro fonts, custom CSS animations, and pixelated UI components.
- **Dynamic Effects**: Web Audio API generated 8-bit sound effects and canvas-confetti celebrate successful deposits and milestones.

### 2. Ritual Identity (.ritual)
- Fully functional onchain identity system (`RitualIdentityRegistry.sol`).
- Users can claim usernames like `alpha.ritual` or `builder.ritual`.
- Seamless ENS-like username resolution across the dApp, including a **Quick Send** widget that automatically routes funds to registered `.ritual` usernames.

### 3. Smart Contract Integration
- **GoalVault.sol**: Secures user funds, manages target milestones, and calculates exact progress logic.
- **GoalManager.sol**: Interfaces with the Ritual Scheduler to enforce recurring deposits.
- **Wagmi & Viem**: Real-time read/write hooks directly executing on the blockchain (no simulated stubs).

### 4. Advanced UX & Performance Optimizations
- **Mobile-First Design**: Ergonomic fixed-bottom navigation for mobile users, responsive sidebar for desktop.
- **Battery & CPU Saver**: Custom hooks utilize `document.hidden` to automatically pause blockchain RPC polling when the browser tab is inactive, preventing device overheating.
- **Silent & Elegant Error Handling**: Captures user-rejected transactions gracefully without triggering disruptive Next.js dev overlays or browser native alerts.

### 5. Multi-Wallet Onboarding
- Integrated with **Reown AppKit (WalletConnect)** to support mobile wallets, MetaMask, Rabby, OKX, and Injected Providers.
- Passkey support for embedded wallet creation.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion.
- **Web3**: Wagmi, Viem, Reown AppKit (WalletConnect).
- **Smart Contracts**: Solidity, Hardhat, deployed on CratD2C Testnet (EVM compatible).
- **Styling**: Custom Pixel Art Design System (No external component libraries).

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and configure:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_RITUAL_RPC_URL=https://rpc.ritual.net
NEXT_PUBLIC_RITUAL_EXPLORER_URL=https://explorer.ritual.net
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the dApp.

### 4. Build for Production
To ensure maximum performance and suppress ESLint/TypeScript warnings during compilation:
```bash
npm run build
npm run start -H 0.0.0.0
```

## 📜 Smart Contracts Overview

- **`GoalVault.sol`**: Core savings vault. Handles `createGoal()`, `deposit()`, and `withdrawWhenCompleted()`.
- **`GoalManager.sol`**: Scheduler logic. Handles `createSchedule()`, `pauseSchedule()`, `resumeSchedule()`, and `cancelSchedule()`.
- **`RitualIdentityRegistry.sol`**: Identity registry. Handles `claimUsername()`, `isAvailable()`, and `ownerOfUsername()`.

## 🏆 Hackathon Pitch

Crypto savings apps usually ask users to manually remember deposits, which leads to high drop-off rates. **TamaSave makes scheduled behavior emotional**: missed saves make pets hungry, successful scheduled saves evolve them, and completed goals become memorable achievements. 

**Ritual Scheduler** is the hero because it turns intent into recurring on-chain action without relying on the user opening the app, effectively transforming decentralized finance into an engaging daily ritual.
