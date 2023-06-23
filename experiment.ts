import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice, calculateFee } from "@cosmjs/stargate"
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"

class CosmJsRpcMethods {
    private mnemonic = "antenna name board hidden shove path team betray blur lens torch sand level laundry family manage virus lottery loan cruise rough basic panther bring";
    private contract_address="wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"
    private client: any;
    private tendermintClient: any;
    private rpUrl:string = "http://localhost:26657";
    // private txHash:string = "9D79E53956FAD1A04CA92EE2A585FF1D40F6C6FFBF5C7F0B098AB2D2FAE49EE8";
    private txHash:string = "0C6D0A73464F29A9E74F64344784CDA8A76B993EBE252F5F89FB75915AE418D1";
    private blockNumber:number = parseInt("64");

    public async getTransaction() {
        try {
            this.client = await SigningCosmWasmClient.connect(this.rpUrl);
            const response = await this.client.queryClient.tx.getTx(this.txHash)
            return response;
        } catch (err) {
            console.log("errrorr==", err);
            return err;
        }
    }

    public async getBlockData() {
        try {
            this.client = await SigningCosmWasmClient.connect(this.rpUrl);
            const response = await this.client.getBlock(await this.client.getHeight());
            return response;
        } catch (err) {
            console.log("errrorr==", err);
            return err;
        }
    }

    public async getFullBlockInfo() {
        try {
            this.client = await SigningCosmWasmClient.connect(this.rpUrl);
            const response = await this.client.queryClient.tmClient.block(await this.client.getHeight())
            return response;
        } catch (err) {
            console.log("errrorr==", err);
            return err;
        }
    }

    public async getAllBlockValidator() {
        try {
            this.tendermintClient = await Tendermint37Client.connect(this.rpUrl);
            const response = await this.tendermintClient.validatorsAll()
            return response;
        } catch (err) {
            console.log("errrorr==", err);
            return err;
        }
    }

    public async getBlockRewards() {
        try {
            this.tendermintClient = await Tendermint37Client.connect(this.rpUrl);
            const response = await this.tendermintClient.blockResults(this.blockNumber);
            return response;
        } catch (err) {
            console.log("errrorr==", err);
            return err;
        }
    }

    public async getHealth() {
        try {
            this.tendermintClient = await Tendermint37Client.connect(this.rpUrl);
            const response = await this.tendermintClient.health();
            return response;
        } catch (err) {
            console.log("errrorr==", err);
            return err;
        }
    }

    public async getStatus() {
        try {
            this.tendermintClient = await Tendermint37Client.connect(this.rpUrl);
            const response = await this.tendermintClient.status();
            return response;
        } catch (err) {
            console.log("errrorr==", err);
            return err;
        }
    }

    public async mint() {
        try {
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(this.mnemonic, { prefix: 'wasm'});
            const address = (await wallet.getAccounts())[0].address
            const wrongAddress = 'wasm1art52u07fznl55xjttfz8negdegekluwj90dzh'
            const tmClient = await Tendermint37Client.connect(this.rpUrl);
            console.log(address);
            console.log(this.contract_address);
            
            
            const gasPrice = GasPrice.fromString('1000stake');
            // console.log(gasPrice);
            
            const executeFee = calculateFee(3508879, gasPrice);
            // console.log(executeFee);
            
            this.client = await SigningCosmWasmClient.createWithSigner(tmClient, wallet);
            // console.log(this.client);
            
            const response = await this.client.execute(
               address, 
               this.contract_address,
               {
                    mint:{
                    recipient: "wasm1art52u07fznl55xjttfz8negdegekluwj90dzh",
                    amount: '10',
                    },
               } ,
            executeFee
            );
            return response;
        } catch (err) {
            console.log("error==", err);
            return err;
        }
    }


   
}

const methods = new CosmJsRpcMethods();

(async () => {
    // const transactionData = await methods.getTransaction();
    const blockData = await methods.getBlockData();
    // const fullblockInfo = await methods.getFullBlockInfo();
    // const validators = await methods.getAllBlockValidator();
    const rewards = await methods.getBlockRewards();
    // const health = await methods.getHealth();
    // const status = await methods.getStatus();
    // const mintResp = await methods.mint();
    // console.log("transaction Data============", transactionData);
    console.log("Block Data============", blockData);
    // console.log("Full Block Data==========", fullblockInfo);
    // console.log("All Validators=========", validators);
    console.log("Block Rewards=========", rewards);
    // console.log("Node Health=========", health);
    // console.log("Node Status=========", status);
    // console.log("mintResp=================", mintResp);
    
})();

export default new CosmJsRpcMethods()