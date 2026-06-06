export const goalVaultAddress = "0xD9c70DeBc7Dcb044AceA403e6630B8Da94750A09" as const;
export const goalManagerAddress = "0x1996f8799E35963b3062D3e78C641200cFa6f8B0" as const;
export const ritualIdentityRegistryAddress = "0xfCafc767beFc958D92298a8419fbBd77d41DeB15" as const;

export const goalVaultAbi = [
  {
    type: "function",
    name: "admin",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "schedulerBot",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "setSchedulerBot",
    stateMutability: "nonpayable",
    inputs: [{ name: "_bot", type: "address" }],
    outputs: []
  },
  {
    type: "function",
    name: "createGoal",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "targetAmount", type: "uint256" },
      { name: "token", type: "address" }
    ],
    outputs: [{ name: "goalId", type: "uint256" }]
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [
      { name: "goalId", type: "uint256" },
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "withdrawWhenCompleted",
    stateMutability: "nonpayable",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "getProgress",
    stateMutability: "view",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: [{ name: "progressBps", type: "uint256" }]
  },
  {
    type: "function",
    name: "goals",
    stateMutability: "view",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "name", type: "string" },
      { name: "token", type: "address" },
      { name: "targetAmount", type: "uint256" },
      { name: "savedAmount", type: "uint256" },
      { name: "completed", type: "bool" },
      { name: "canceled", type: "bool" }
    ]
  },
  {
    type: "function",
    name: "getOwnerGoals",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "goalIds", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "cancelGoal",
    stateMutability: "nonpayable",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: []
  },
  {
    type: "event",
    name: "GoalCreated",
    inputs: [
      { indexed: true, name: "goalId", type: "uint256" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: true, name: "token", type: "address" },
      { indexed: false, name: "targetAmount", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "Deposited",
    inputs: [
      { indexed: true, name: "goalId", type: "uint256" },
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "savedAmount", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "GoalCanceledEvent",
    inputs: [
      { indexed: true, name: "goalId", type: "uint256" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "penalty", type: "uint256" },
      { indexed: false, name: "returnAmount", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { indexed: true, name: "goalId", type: "uint256" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "amount", type: "uint256" }
    ]
  }
] as const;

export const goalManagerAbi = [
  {
    type: "function",
    name: "goalToSchedule",
    stateMutability: "view",
    inputs: [{ name: "goalId", type: "uint256" }],
    outputs: [{ name: "scheduleId", type: "bytes32" }]
  },
  {
    type: "function",
    name: "schedules",
    stateMutability: "view",
    inputs: [{ name: "scheduleId", type: "bytes32" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "goalId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "cadenceSeconds", type: "uint64" },
      { name: "nextRunAt", type: "uint64" },
      { name: "status", type: "uint8" }
    ]
  },
  {
    type: "function",
    name: "createSchedule",
    stateMutability: "nonpayable",
    inputs: [
      { name: "goalId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "cadenceSeconds", type: "uint64" }
    ],
    outputs: [{ name: "scheduleId", type: "bytes32" }]
  },
  {
    type: "function",
    name: "pauseSchedule",
    stateMutability: "nonpayable",
    inputs: [{ name: "scheduleId", type: "bytes32" }],
    outputs: []
  },
  {
    type: "function",
    name: "resumeSchedule",
    stateMutability: "nonpayable",
    inputs: [{ name: "scheduleId", type: "bytes32" }],
    outputs: []
  },
  {
    type: "function",
    name: "cancelSchedule",
    stateMutability: "nonpayable",
    inputs: [{ name: "scheduleId", type: "bytes32" }],
    outputs: []
  }
] as const;

export const ritualIdentityRegistryAbi = [
  {
    type: "function",
    name: "ownerOfUsername",
    stateMutability: "view",
    inputs: [{ name: "usernameHash", type: "bytes32" }],
    outputs: [{ name: "owner", type: "address" }]
  },
  {
    type: "function",
    name: "claimUsername",
    stateMutability: "nonpayable",
    inputs: [{ name: "username", type: "string" }],
    outputs: []
  },
  {
    type: "function",
    name: "updateProfile",
    stateMutability: "nonpayable",
    inputs: [
      { name: "newUsername", type: "string" },
      { name: "newPfp", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "isAvailable",
    stateMutability: "view",
    inputs: [{ name: "username", type: "string" }],
    outputs: [{ name: "available", type: "bool" }]
  },
  {
    type: "function",
    name: "identityOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [
      { name: "username", type: "string" },
      { name: "pfp", type: "string" },
      { name: "memberSince", type: "uint64" }
    ]
  },
  {
    type: "event",
    name: "IdentityRegistered",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "username", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "ProfileUpdated",
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "username", type: "string" },
      { indexed: false, name: "pfp", type: "string" }
    ]
  }
] as const;
