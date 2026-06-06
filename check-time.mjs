import { createPublicClient, http } from 'viem';

// Just use bare viem:
const client = createPublicClient({
  transport: http('https://rpc.ritualfoundation.org/')
});

async function run() {
  const b = await client.getBlock({ blockTag: 'latest' });
  console.log("Latest block:", b.number);
  console.log("Timestamp:", b.timestamp);
  console.log("Timestamp type:", typeof b.timestamp);
  console.log("As Number:", Number(b.timestamp));
  const tsMs = Number(b.timestamp) * 1000;
  console.log("Date:", new Date(tsMs).toISOString());
}
run();
