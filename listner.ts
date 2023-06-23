import WebSocket from "websocket"
import CosmJsRpcMethods from './experiment'
const contract_address="wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"


function connect(){
// Creates new WebSocket object with a wss URI as the parameter
const socket = new WebSocket.w3cwebsocket('ws://localhost:26657/websocket');



// Fired when a connection with a WebSocket is opened
socket.onopen = function () {
    socket.send(JSON.stringify({ "jsonrpc": "2.0", "method": "subscribe", "params": ["tm.event='NewBlock'"], "id": 1 }))
    //NewBlock
    //Tx
    //ValidatorSetUpdates
    console.log("connection open")
};

// Fired when data is received through a WebSocket

socket.onmessage = function (event:any) {

    try {
        const data=JSON.parse(event.data).result;
        // CosmJsRpcMethods.getBlockRewards
        console.log(data);
        
    }
       catch (error:any) {
        console.log(error.message);
        
    }


};

// Fired when a connection with a WebSocket is closed
socket.onclose = function () {
console.log('Socket is closed. Reconnect will be attempted in 1 second.');
setTimeout(function() {
  connect();
}, 1000);
}
// Fired when a connection with a WebSocket has been closed because of an error
socket.onerror = function (event:any) {
    console.log("connection error", event)
};
}

connect();
