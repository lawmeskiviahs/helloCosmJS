import { Block, SigningStargateClient} from "@cosmjs/stargate"
import { DirectSecp256k1HdWallet} from "@cosmjs/proto-signing"
import { encodeSecp256k1Pubkey, pubkeyToAddress } from '@cosmjs/amino';

const rpc = "localhost:26657"
const mnemonic = "damp dish bottom grain swamp view merge noise lunar math above old all now diamond pact boy flavor you express awake color token salt";
const addressPrefix = 'cosmos';

const runAll = async(): Promise<void> => {
    
    // create wallet and get account
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const [account] = await wallet.getAccounts();
    const signer = wallet;

    console.log("enter");
    
    // creating connection instance
    const client = await SigningStargateClient.connectWithSigner(rpc, signer);

    // get address with prefix
    const publicKey = encodeSecp256k1Pubkey(account.pubkey);
    const address = pubkeyToAddress(publicKey, addressPrefix);
    console.log(address)
    console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight())
    console.log("Alice balances:", await client.getAllBalances("cosmos1lkvnypzp9833lksyq3jur45ll5xq5vmlvk32gh"), )

    // get block data
    const blockHeight = await client.getHeight(); // Replace with the desired block height
    const block: Block | null = await client.getBlock(blockHeight);
    if (block) {
      console.log('Block Data:', block);
    } else {
      console.log('Block not found');
    }

}

runAll()
