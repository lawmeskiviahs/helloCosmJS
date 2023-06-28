import { GasPrice, calculateFee, QueryClient, setupStakingExtension  } from "@cosmjs/stargate"
import { fromBase64, toHex } from "@cosmjs/encoding";
import { pubkeyToAddress } from "@cosmjs/tendermint-rpc";
import { anyToSinglePubkey } from "@cosmjs/proto-signing";
import bech32 from "bech32";
import { assert } from "@cosmjs/utils";

class CosmJsRpcMethods {

    public contract_address = "wasm14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s0phg4d"
    public txHash: string = "<Your tx hash here>"
    public blockNumber: number = parseInt("0")
    public prefix = 'wasm'

    public async getTransaction(cosmWasmClient: any) {
        try {

            const response = await cosmWasmClient.queryClient.tx.getTx(this.txHash)

            return response
        } catch (err) {
            console.log("getTx error ==", err)
            return err
        }
    }

    public async getBlockData(cosmWasmClient: any) {
        try {

            this.blockNumber = await cosmWasmClient.getHeight()
            const response = await cosmWasmClient.getBlock(this.blockNumber)

            return response
        } catch (err) {
            console.log("getBlockData error ==", err)
            return err
        }
    }

    public async getFullBlockInfo(cosmWasmClient: any) {
        try {

            const response = await cosmWasmClient.queryClient.tmClient.block(this.blockNumber)

            return response
        } catch (err) {
            console.log("getFullBlockInfo error ==", err)
            return err
        }
    }

    public async getAllBlockValidator(tendermintClient: any) {
        try {

            const response = await tendermintClient.validatorsAll()

            return response
        } catch (err) {
            console.log("getAllBlockValidator error ==", err)
            return err
        }
    }

    public async getBlockRewards(tendermintClient: any) {
        try {

            const response = await tendermintClient.blockResults(this.blockNumber)

            return response
        } catch (err) {
            console.log("getBlockRewards error ==", err)
            return err
        }
    }

    public async getHealth(tendermintClient: any) {
        try {

            const response = await tendermintClient.health()

            return response
        } catch (err) {
            console.log("getHealth error ==", err)
            return err
        }
    }

    public async getStatus(tendermintClient: any) {
        try {

            const response = await tendermintClient.status()

            return response
        } catch (err) {
            console.log("getStatus error ==", err)
            return err
        }
    }

    // Sends mint instruction to 'this.contract_address' cw-20 contract for minting 'amount' tokens
    public async mint(cosmWasmClient: any, amount: string, wallet: any, address: string) {
        try {

            const senderAddress = (await wallet.getAccounts())[0].address

            const gasPrice = GasPrice.fromString("1000stake")
            const executeFee = calculateFee(3508879, gasPrice)

            // sending an execute instruction to the contract
            const response = await cosmWasmClient.execute(
                senderAddress,
                this.contract_address,
                {
                    mint: {
                        recipient: senderAddress,
                        amount: amount,
                    },
                },
                executeFee
            )

            return response
        } catch (err) {
            console.log("mint error ==", err)
            return err
        }
    }

    public async query(cosmWasmClient: any, address: string) {
        try {

            // sending an query instruction to the contract
            const response = await cosmWasmClient.queryContractSmart(
                this.contract_address,
                {
                    balance: {
                        address: address,
                    },
                },
            )

            return response
        } catch (err) {
            console.log("query error ==", err)
            return err
        }
    }

    public async getProposerAddress(cosmWasmClient: any) {
        try {

            const response = await cosmWasmClient.queryClient.tmClient.block(this.blockNumber);
              const address = toHex(response.block.header.proposerAddress).toUpperCase();

            return address;
        } catch (err) {
            console.log("getProposerAddress error==", err);
            return err;
        }
    }

    public async getTendermintValidatorAddressToValoperAddress(tendermintClient: any, blockHeight: number, address: string) {
        try {

            const queryClient = QueryClient.withExtensions(tendermintClient, setupStakingExtension);
            const tendermintToOperator = new Map<string, string>();
            let nextKey: Uint8Array | undefined;
            do {
                const res = await queryClient.staking.validators("BOND_STATUS_BONDED", nextKey);
                res.validators.forEach((r) => {
                    assert(r.consensusPubkey);
                    const pubkey = anyToSinglePubkey(r.consensusPubkey);
                    const address = pubkeyToAddress("ed25519", fromBase64(pubkey.value));
                    tendermintToOperator.set(address, r.operatorAddress);
                })
                nextKey = res.pagination?.nextKey;
            } while (nextKey?.length)
            const valoperAddress: any = tendermintToOperator.get(address);
            return valoperAddress;

        } catch (err) {
            console.log("getTendermintValidatorAddressToValoperAddress error==", err);
            return err;
        }
    }

    public async getDelegatorAddress(operatorAddr: any) {
        try {
            let address = await bech32.decode(operatorAddr);
            let delegatorAddress = await bech32.encode(this.prefix, address.words);
            return delegatorAddress;
        } catch (err) {
            console.log("getDelegatorAddress error ==", err);
            return err;
        }
    }

}

export default new CosmJsRpcMethods()
