import WebSocket from "websocket"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { Tendermint37Client } from "@cosmjs/tendermint-rpc"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import CosmJsRpcMethods from "./experiment"

async function connect() {

    // Creates new WebSocket object with a wss URI as the parameter
    const socket = new WebSocket.w3cwebsocket("ws://localhost:26657/websocket")
    const rpcUrl: string = "http://localhost:26657" // for localhost
    const mnemonic =
        "antenna name board hidden shove path team betray blur lens torch sand level laundry family manage virus lottery loan cruise rough basic panther bring"

    // Fired when a connection with a WebSocket is opened
    socket.onopen = async function () {

        // To subscrible for events based on:
        //NewBlock
        //Tx
        //ValidatorSetUpdates
        socket.send(
            JSON.stringify({
                jsonrpc: "2.0",
                method: "subscribe",
                params: ["tm.event='NewBlock'"],
                id: 1,
            })
        )

        console.log("connection open")
    }

    // Fired when data is received through a WebSocket
    socket.onmessage = async function (event: any) {
        try {

            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "wasm" })
            const tendermintClient = await Tendermint37Client.connect(rpcUrl)
            const cosmWasmClient = await SigningCosmWasmClient.createWithSigner(tendermintClient, wallet)

            // To parse the data from the event
            // const data = JSON.parse(event.data).result
            // console.log(data)

            // Methods from experiment.ts
            // const blockRewards = await CosmJsRpcMethods.getBlockRewards(cosmWasmClient, tendermintClient);
            // const data=JSON.parse(blockRewards);
            // console.log(blockRewards);
            // const blockData = await CosmJsRpcMethods.getBlockData(cosmWasmClient);
            // console.log(blockData.txs);
            // const blockFullData = await CosmJsRpcMethods.getFullBlockInfo(cosmWasmClient);
            // console.log(blockFullData);
            // const amount:string = "1";
            // const mintResp = await CosmJsRpcMethods.mint(cosmWasmClient, amount, wallet);
            // console.log(mintResp);
            
        } catch (error: any) {
            console.log(error.message)
        }
    }

    // Fired when a connection with a WebSocket is closed
    socket.onclose = async function () {
        console.log("Socket is closed. Reconnect will be attempted in 1 second.")
        setTimeout(function () {
            connect()
        }, 1000)
    }

    // Fired when a connection with a WebSocket has been closed because of an error
    socket.onerror = async function (event: any) {
        console.log("connection error", event)
    }
}

connect()
