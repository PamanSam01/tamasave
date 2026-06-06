import { createPublicClient, http } from 'viem';

const client = createPublicClient({ 
  transport: http('https://rpc.ritualfoundation.org/') 
});

client.readContract({ 
  address: '0x4E852acf69c31AF7aA5986966F07fD89Fb14e957', 
  abi: [{ 
    type: 'function', 
    name: 'identityOf', 
    stateMutability: 'view', 
    inputs: [{ name: 'owner', type: 'address' }], 
    outputs: [{ name: 'username', type: 'string' }, { name: 'memberSince', type: 'uint64' }] 
  }], 
  functionName: 'identityOf', 
  args: ['0x38e4a1a5b6d76B38db7bcf05f9Ece2Fceabf6FAb'] 
}).then(console.log).catch(console.error);
