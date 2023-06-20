import { Block, SigningStargateClient, IndexedTx, SearchTxQuery} from "@cosmjs/stargate"
import { DirectSecp256k1HdWallet, OfflineDirectSigner} from "@cosmjs/proto-signing"

const { sha256 } = require("@cosmjs/crypto")
const { toHex } = require("@cosmjs/encoding")

const rpc = "localhost:26657"
const mnemonic = "gauge vehicle useless chief vocal decorate vacuum require grant cable goat snake sphere sand marriage rigid fox erosion begin mechanic image orphan logic cause";
const addressPrefix = 'cosmos';
// const txHash = 
const txRaw = "Co8BCowBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKLWNvc21vczFmbWQzMHR0bXdubDB6NHZ5bWwwcTZweHEzamx3YTM3anAzN2FhcxItY29zbW9zMWZtZDMwdHRtd25sMHo0dnltbDBxNnB4cTNqbHdhMzdqcDM3YWFzGgwKBXN0YWtlEgMxMDASWApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohArsSTPT/p8PvGY2Xhs8J2eq9Cy2a5H7UaXvDDqeLQ0NjEgQKAggBGAESBBDAmgwaQG17xMsgK0xy5vOmI6BDcUkQt+NLRLfFGPBrJB7IcIRhK7/+DY19h+ZCcaYLboFAswU+3I0hweoectIvIYN0ph0="
const txHash = toHex(sha256(Buffer.from(txRaw, 'base64')))


const runAll = async(): Promise<void> => {
    
    // create wallet with prefix
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'cosmos'});
    const aliceSigner: OfflineDirectSigner = wallet
    const alice = (await aliceSigner.getAccounts())[0].address
    
    console.log("enter");
    
    // creating connection instance
    const client = await SigningStargateClient.connectWithSigner(rpc, aliceSigner);

    console.log(alice)


    console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight())

    //get tx data 
    // console.log(txHash)
    // const txhashh =txHash.toUpperCase()
    // console.log(txhashh);
    
    // const txData: IndexedTx = (await client.getTx(txhashh))!
    // console.log(txData);
    

}

runAll()
