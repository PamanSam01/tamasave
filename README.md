# TamaSave

TamaSave is a gamified, autonomous crypto savings protocol. It transforms the mundane task of dollar-cost averaging and saving funds into an engaging experience by turning every savings goal into an evolving, Tamagotchi-style digital pet. 

Traditional decentralized finance (DeFi) savings platforms suffer from high user drop-off rates because they rely on manual user intervention. **TamaSave solves this by leveraging Ritual Scheduler**, allowing users to commit to a savings goal once, and letting the protocol autonomously execute deposits on their behalf.

## 🌟 The Problem & Solution

### The Problem
Most crypto users fail to stick to long-term savings or DCA (Dollar-Cost Averaging) plans. The friction of opening a wallet, paying gas, and manually signing a transaction every week is too high. 

### The Solution: Ritual Scheduler
TamaSave utilizes the **Ritual Scheduler** to transform intent into autonomous onchain action. When a user creates a savings goal, TamaSave registers a recurring task with the Scheduler. This keeper network automatically calls the protocol on the specified cadence (daily, weekly, monthly) to deposit funds on the user's behalf. 
- **Emotional Engagement**: Missed saves make pets hungry; successful saves evolve them (Egg → Baby → Teen → Adult → Legendary).
- **Frictionless**: Set it and forget it.

## 🏛 Architecture Overview

TamaSave is composed of three primary smart contracts interacting seamlessly:

1. **`GoalVault.sol`**: The core escrow contract. It holds user funds, tracks the `savedAmount` vs `targetAmount`, and handles the logic for `deposit()`, `withdrawWhenCompleted()`, and penalty-enforced `cancelGoal()`.
2. **`GoalManager.sol`**: The scheduling logic. It interfaces directly with the Ritual Scheduler network to create, pause, resume, and cancel automated deposit schedules (`createSchedule`). It maps a `scheduleId` to a specific `goalId` in the Vault.
3. **`RitualIdentityRegistry.sol`**: A decentralized identity system ensuring users are recognized by human-readable `.ritual` usernames rather than raw hexadecimal addresses.

### The Flow
1. User approves USDC/RITUAL spending for `GoalVault`.
2. User calls `GoalVault.createGoal(...)`.
3. User calls `GoalManager.createSchedule(...)` establishing the cadence.
4. **Ritual Scheduler** pings `GoalVault.deposit(...)` autonomously based on the schedule.
5. Once `GoalVault` reports progress = 100%, the user can `withdrawWhenCompleted()`.

## 🪪 Ritual Identity (.ritual)
TamaSave implements a built-in decentralized namespace. 
- Users claim unique identities like `satoshi.ritual`.
- Identities are mapped to their wallet addresses via `RitualIdentityRegistry`.
- TamaSave's **Quick Send Widget** uses this registry to allow seamless peer-to-peer token transfers simply by typing a username, auto-resolving to the underlying address.

## 📱 Mobile-First Experience
TamaSave is built for the modern Web3 user. It features:
- **Ergonomic Fixed-Bottom Navigation**: Easy thumb access on mobile devices.
- **Battery & CPU Optimization**: Custom React hooks utilize `document.hidden` to automatically pause blockchain polling when the dApp is backgrounded.
- **Silent Error Handling**: User-rejected transactions are caught gracefully without triggering disruptive browser alerts.

---

## 📸 Screenshots

*(Placeholders for future screenshots)*

| Dashboard Overview | Pet Evolution | Mobile Navigation | Quick Send Widget |
|:---:|:---:|:---:|:---:|
| `[Screenshot 1]` | `[Screenshot 2]` | `[Screenshot 3]` | `[Screenshot 4]` |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js >= 18.17
- npm or pnpm

### 1. Install Dependencies
```bash
git clone https://github.com/PamanSam01/tamasave.git
cd tamasave
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure your keys:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_RITUAL_RPC_URL=https://rpc.ritual.net
NEXT_PUBLIC_RITUAL_EXPLORER_URL=https://explorer.ritual.net
```

For smart contract deployments, create a `.env` file:
```bash
RITUAL_RPC_URL=https://rpc.ritual.net
DEPLOYER_PRIVATE_KEY=your_private_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
To ensure maximum performance and bypass strict Linter/TS warnings during compilation:
```bash
npm run build
npm run start -H 0.0.0.0
```

---

## 🗺 Roadmap

- [x] Core Smart Contracts (Vault, Manager, Identity)
- [x] Responsive Mobile-First UI
- [x] WalletConnect (Reown) Integration
- [x] 8-bit Sound Effects & Particle Effects
- [ ] Implement L402 Credit Purchase for AI Reminders
- [ ] Push Notifications for Missed Saves
- [ ] Dynamic SVG NFT generation for fully evolved pets

## 🤝 Contribution

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License
Distributed under the MIT License.
