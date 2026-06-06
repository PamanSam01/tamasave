import { createPublicClient, http } from 'viem';

const client = createPublicClient({ 
  transport: http('https://rpc.ritualfoundation.org/') 
});

client.getBlock().then(b => {
  console.log("Current block timestamp:", b.timestamp);
  console.log("Date:", new Date(Number(b.timestamp) * 1000).toString());
}).catch(console.error);
