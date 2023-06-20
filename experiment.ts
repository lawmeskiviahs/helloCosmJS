import { StargateClient, Block } from "@cosmjs/stargate"

const rpc = "localhost:26657"

const runAll = async(): Promise<void> => {
    console.log("enter");
    
    const client = await StargateClient.connect(rpc)
    console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight())

    // console.log("Alice balances:", await client.getAllBalances("cosmos1lkvnypzp9833lksyq3jur45ll5xq5vmlvk32gh"), )
    
    const blockHeight = await client.getHeight(); // Replace with the desired block height
    const block: Block | null = await client.getBlock(blockHeight);

    if (block) {
      console.log('Block Data:', block);
    } else {
      console.log('Block not found');
    }

}

runAll()
