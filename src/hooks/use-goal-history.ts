import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { parseAbiItem, formatUnits } from "viem";
import { goalVaultAddress } from "@/lib/contracts";
import { GoalHistory } from "@/lib/types";

export function useGoalHistory(goalId: string) {
  const publicClient = usePublicClient();
  const [history, setHistory] = useState<GoalHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!publicClient || !goalId) return;

    const fetchHistory = async () => {
      if (document.hidden) return; // Save battery/CPU when tab is hidden
      try {
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > BigInt(99000) ? currentBlock - BigInt(99000) : BigInt(0);

        const [depositLogs, createLogs, withdrawLogs, cancelLogs] = await Promise.all([
          publicClient.getLogs({
            address: goalVaultAddress,
            event: parseAbiItem('event Deposited(uint256 indexed goalId, address indexed from, uint256 amount, uint256 savedAmount)'),
            args: { goalId: BigInt(goalId) },
            fromBlock,
            toBlock: 'latest'
          }),
          publicClient.getLogs({
            address: goalVaultAddress,
            event: parseAbiItem('event GoalCreated(uint256 indexed goalId, address indexed owner, string name, address indexed token, uint256 targetAmount)'),
            args: { goalId: BigInt(goalId) },
            fromBlock,
            toBlock: 'latest'
          }),
          publicClient.getLogs({
            address: goalVaultAddress,
            event: parseAbiItem('event Withdrawn(uint256 indexed goalId, address indexed owner, uint256 amount)'),
            args: { goalId: BigInt(goalId) },
            fromBlock,
            toBlock: 'latest'
          }),
          publicClient.getLogs({
            address: goalVaultAddress,
            event: parseAbiItem('event GoalCanceledEvent(uint256 indexed goalId, address indexed owner, uint256 penalty, uint256 returnAmount)'),
            args: { goalId: BigInt(goalId) },
            fromBlock,
            toBlock: 'latest'
          })
        ]);
        
        let allLogs = [
          ...createLogs.map(l => ({ ...l, type: 'create' })),
          ...depositLogs.map(l => ({ ...l, type: 'deposit' })),
          ...withdrawLogs.map(l => ({ ...l, type: 'withdraw' })),
          ...cancelLogs.map(l => ({ ...l, type: 'cancel' }))
        ];

        allLogs.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

        const blockPromises = Array.from(new Set(allLogs.map(l => l.blockNumber))).map(async bNum => {
          if (!bNum) return { number: BigInt(0), timestamp: BigInt(0) };
          return publicClient.getBlock({ blockNumber: bNum });
        });
        const blocks = await Promise.all(blockPromises);
        const blockMap = new Map(blocks.map(b => [b.number?.toString(), Number(b.timestamp)]));

        const items: GoalHistory[] = allLogs.map(log => {
          let label = "";
          let amount: number | undefined = undefined;
          const timestamp = blockMap.get(log.blockNumber?.toString()) || Math.floor(Date.now() / 1000);
          
          let finalTimestampMs = timestamp;
          if (timestamp < 10000000000) {
            finalTimestampMs = timestamp * 1000;
          }
          
          const createdAt = new Date(finalTimestampMs).toISOString();
          const args = log.args as any;

          if (log.type === 'create') {
            label = `Created goal: ${args.name}`;
          } else if (log.type === 'deposit') {
            amount = Number(formatUnits(args.amount as bigint, 18));
            label = `Fed pet`;
          } else if (log.type === 'withdraw') {
            amount = Number(formatUnits(args.amount as bigint, 18));
            label = `Withdrew savings`;
          } else if (log.type === 'cancel') {
            label = `Canceled goal`;
          }

          return {
            id: `${log.transactionHash}-${log.logIndex}`,
            label,
            createdAt,
            amount,
            type: log.type as any
          };
        });

        // Cache implementation
        const cacheKey = `goal_history_${goalId}`;
        const cachedStr = localStorage.getItem(cacheKey);
        let cachedItems: GoalHistory[] = [];
        if (cachedStr) {
          try {
            cachedItems = JSON.parse(cachedStr);
          } catch (e) {}
        }

        // Merge and deduplicate
        const itemMap = new Map<string, GoalHistory>();
        cachedItems.forEach(item => itemMap.set(item.id, item));
        items.forEach(item => itemMap.set(item.id, item));

        const mergedItems = Array.from(itemMap.values());
        mergedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        localStorage.setItem(cacheKey, JSON.stringify(mergedItems));
        setHistory(mergedItems);
      } catch (err) {
        // console.error("Error fetching goal history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [publicClient, goalId]);

  return { history, isLoading };
}
