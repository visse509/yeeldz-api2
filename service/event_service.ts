import Web3 from 'web3'
import UniversalProfileContract from '@lukso/universalprofile-smart-contracts/build/artifacts/UniversalProfile.json';
import KeyManagerContract from '@lukso/universalprofile-smart-contracts/build/artifacts/KeyManager.json';
import {abiEvents, eventsHash, CHAIN_ID} from "../globals";
import axios from "axios";
import {keyManagerAbi} from '../KeyManagerOverride'
import crypto from "crypto";

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.l14.lukso.network"));



export const createEvent = async () => {
    const privateKey = "0x94ce850ede800f18d26a548c8ee30381ad30efdbbb0d8e8a58404035309a5d96"
    const myUpAddress = "0x6b3E2937b1C94A675f7bf6f79a3Cf0237903d4f4"
    console.log("creating event")
    const universalProfile = new web3.eth.Contract(UniversalProfileContract.abi, myUpAddress);
    const keyManagerAddress = await universalProfile.methods.owner().call();
    const KeyManager = new web3.eth.Contract(KeyManagerContract.abi, keyManagerAddress);

   const KeyManagerRelayer = new web3.eth.Contract(
        keyManagerAbi,
        keyManagerAddress,
    );

    const controllerAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    const controllerAddress = controllerAccount.address;

    console.log("controller address", controllerAddress)

    const nonce = await KeyManager.methods.getNonce(controllerAddress, 0).call()

    const eventsContract = new web3.eth.Contract(
        abiEvents,
        eventsHash
    );

    const traceId = crypto.randomUUID()
    const eventsTransaction = eventsContract.methods.createEvent(traceId);

    const abiPayload = universalProfile.methods.execute(
        0,
        eventsHash,
        0,
        eventsTransaction.encodeABI()
    ).encodeABI()


    const message = web3.utils.soliditySha3(
        keyManagerAddress, nonce,
        {
            t: 'bytes',
            v: abiPayload,
        },
    );

    const signatureObject = controllerAccount.sign(message);
    const signature = signatureObject.signature;

    const keyManagerCall = KeyManagerRelayer.methods.executeRelayCall(
        keyManagerAddress,
        nonce,
        abiPayload,
        signature,
    )

    const gas = await keyManagerCall.estimateGas({from: controllerAddress});
    const gasPrice = await web3.eth.getGasPrice();
    const data = keyManagerCall.encodeABI()
    const nonce2 = await web3.eth.getTransactionCount(controllerAddress);

    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: KeyManagerRelayer.options.address,
            from: controllerAddress,
            data,
            gas: gas,
            gasPrice,
            nonce2,
            chainId: CHAIN_ID
        },
        privateKey
    );

    console.log(signedTx)

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    await web3.eth.getTransactionReceipt(receipt.transactionHash, () => {
        console.log("Sent contract")
    })
    console.log("receipt",receipt)
    return {}
    // return await getEventId(traceId)
}

