import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { parseAbiItem, formatUnits } from "viem";
import { goalVaultAddress, ritualIdentityRegistryAddress } from "@/lib/contracts";

export type ActivityItem = {
  id: string;
  label: string;
  createdAt: string;
  amount?: number;
  blockNumber: number;
  goalId?: string;
  type: 'identity' | 'create' | 'deposit' | 'withdraw' | 'cancel';
};

export function useLiveActivity() {
  const publicClient = usePublicClient();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!publicClient) return;

    const fetchLogs = async () => {
      if (document.hidden) return; // Save battery/CPU when tab is hidden
      try {
        const currentBlock = await publicClient.getBlockNumber();
        // Fetch last 50,000 blocks to avoid RPC limits
        const fromBlock = currentBlock > BigInt(50000) ? currentBlock - BigInt(50000) : BigInt(0);

        const [idLogs, createLogs, depositLogs, withdrawLogs, cancelLogs] = await Promise.all([
          publicClient.getLogs({
            address: ritualIdentityRegistryAddress,
            event: parseAbiItem('event IdentityRegistered(address indexed user, string username, uint256 timestamp)'),
            fromBlock,
            toBlock: 'latest'
          }),
          publicClient.getLogs({
            address: goalVaultAddress,
            event: parseAbiItem('event GoalCreated(uint256 indexed goalId, address indexed owner, string name, address indexed token, uint256 targetAmount)'),
            fromBlock,
            toBlock: 'latest'
          }),
          publicClient.getLogs({
            address: goalVaultAddress,
            event: parseAbiItem('event Deposited(uint256 indexed goalId, address indexed from, uint256 amount, uint256 savedAmount)'),
            fromBlock,
            toBlock: 'latest'
          }),
          publicClient.getLogs({
            address: goalVaultAddress,
            event: parseAbiItem('event Withdrawn(uint256 indexed goalId, address indexed owner, uint256 amount)'),
            fromBlock,
            toBlock: 'latest'
          }),
          publicClient.getLogs({
            address: goalVaultAddress,
            event: parseAbiItem('event GoalCanceledEvent(uint256 indexed goalId, address indexed owner, uint256 penalty, uint256 returnAmount)'),
            fromBlock,
            toBlock: 'latest'
          })
        ]);
        
        let allLogs = [
          ...idLogs.map(l => ({ ...l, type: 'identity' })),
          ...createLogs.map(l => ({ ...l, type: 'create' })),
          ...depositLogs.map(l => ({ ...l, type: 'deposit' })),
          ...withdrawLogs.map(l => ({ ...l, type: 'withdraw' })),
          ...cancelLogs.map(l => ({ ...l, type: 'cancel' }))
        ];

        // Sort descending by block number
        allLogs.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
        // Take top 20 events
        allLogs = allLogs.slice(0, 20);

        // Fetch block timestamps in parallel
        const blockPromises = Array.from(new Set(allLogs.map(l => l.blockNumber))).map(async bNum => {
          if (!bNum) return { number: BigInt(0), timestamp: BigInt(0) };
          return publicClient.getBlock({ blockNumber: bNum });
        });
        const blocks = await Promise.all(blockPromises);
        const blockMap = new Map(blocks.map(b => [b.number?.toString(), Number(b.timestamp)]));

        const items: ActivityItem[] = allLogs.map(log => {
          let label = "";
          let amount: number | undefined = undefined;
          const timestamp = blockMap.get(log.blockNumber?.toString()) || Math.floor(Date.now() / 1000);
          
          let finalTimestampMs = timestamp;
          if (timestamp < 10000000000) {
            finalTimestampMs = timestamp * 1000;
          }
          
          const createdAt = new Date(finalTimestampMs).toISOString();
          
          const args = log.args as any;
          const shortAddress = args.owner ? `${args.owner.slice(0, 6)}...` : args.user ? `${args.user.slice(0, 6)}...` : args.from ? `${args.from.slice(0, 6)}...` : "Someone";

          if (log.type === 'identity') {
            label = `${args.username} joined TamaSave!`;
          } else if (log.type === 'create') {
            label = `${shortAddress} created a new pet: ${args.name}`;
          } else if (log.type === 'deposit') {
            amount = Number(formatUnits(args.amount as bigint, 18));
            label = `${shortAddress} fed Pet #${args.goalId}`;
          } else if (log.type === 'withdraw') {
            amount = Number(formatUnits(args.amount as bigint, 18));
            label = `${shortAddress} withdrew savings (Goal Reached!)`;
          } else if (log.type === 'cancel') {
            label = `${shortAddress} gave up and canceled Pet #${args.goalId} 💀`;
          }

          return {
            id: `${log.transactionHash}-${log.logIndex}`,
            label,
            createdAt,
            amount,
            blockNumber: Number(log.blockNumber),
            goalId: args.goalId ? args.goalId.toString() : undefined,
            type: log.type as 'identity' | 'create' | 'deposit' | 'withdraw' | 'cancel'
          };
        });

        // Cache implementation
        const cacheKey = `live_activity_global`;
        const cachedStr = localStorage.getItem(cacheKey);
        let cachedItems: ActivityItem[] = [];
        if (cachedStr) {
          try {
            cachedItems = JSON.parse(cachedStr);
          } catch (e) {}
        }

        // Merge and deduplicate
        const itemMap = new Map<string, ActivityItem>();
        cachedItems.forEach(item => itemMap.set(item.id, item));
        items.forEach(item => itemMap.set(item.id, item));

        let mergedItems = Array.from(itemMap.values());
        mergedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Keep only top 50 to prevent localStorage bloat
        mergedItems = mergedItems.slice(0, 50);

        localStorage.setItem(cacheKey, JSON.stringify(mergedItems));
        setActivities(mergedItems);
      } catch (err) {
        // console.error("Error fetching live activity:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
    
    const interval = setInterval(fetchLogs, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [publicClient]);

  return { activities, isLoading };
}
