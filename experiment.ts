import { GasPrice, calculateFee } from "@cosmjs/stargate"

class CosmJsRpcMethods {

    public contract_address = "wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"
    public txHash: string = "<Your tx hash here>"
    public blockNumber: number = parseInt("0")

    public async getTransaction(cosmWasmClient: any) {
        try {

            const response = await cosmWasmClient.queryClient.tx.getTx(this.txHash)

            return response
        } catch (err) {
            console.log("error getTx==", err)
            return err
        }
    }

    public async getBlockData(cosmWasmClient: any) {
        try {

            this.blockNumber = await cosmWasmClient.getHeight()
            const response = await cosmWasmClient.getBlock(this.blockNumber)

            return response
        } catch (err) {
            console.log("error getBlockData==", err)
            return err
        }
    }

    public async getFullBlockInfo(cosmWasmClient: any) {
        try {

            this.blockNumber = await cosmWasmClient.getHeight()
            const response = await cosmWasmClient.queryClient.tmClient.block(this.blockNumber)

            return response
        } catch (err) {
            console.log("error getFullBlockInfo==", err)
            return err
        }
    }

    public async getAllBlockValidator(tendermintClient: any) {
        try {

            const response = await tendermintClient.validatorsAll()

            return response
        } catch (err) {
            console.log("error getAllBlockValidator==", err)
            return err
        }
    }

    public async getBlockRewards(cosmWasmClient: any, tendermintClient: any) {
        try {

            this.blockNumber = await cosmWasmClient.getHeight()
            const response = await tendermintClient.blockResults(this.blockNumber)

            return response
        } catch (err) {
            console.log("error getBlockRewards==", err)
            return err
        }
    }

    public async getHealth(tendermintClient: any) {
        try {

            const response = await tendermintClient.health()

            return response
        } catch (err) {
            console.log("error getHealth==", err)
            return err
        }
    }

    public async getStatus(tendermintClient: any) {
        try {

            const response = await tendermintClient.status()

            return response
        } catch (err) {
            console.log("error getStatus==", err)
            return err
        }
    }

    // Sends mint instruction to 'this.contract_address' cw-20 contract for minting 'amount' tokens
    public async mint(cosmWasmClient: any, amount: string, wallet: any) {
        try {

            const address = (await wallet.getAccounts())[0].address

            const gasPrice = GasPrice.fromString("1000stake")
            const executeFee = calculateFee(3508879, gasPrice)

            // sending an execute instruction to the contract
            const response = await cosmWasmClient.execute(
                address,
                this.contract_address,
                {
                    mint: {
                        recipient: "wasm1art52u07fznl55xjttfz8negdegekluwj90dzh",
                        amount: amount,
                    },
                },
                executeFee
            )

            return response
        } catch (err) {
            console.log("error mint==", err)
            return err
        }
    }

}

export default new CosmJsRpcMethods()
