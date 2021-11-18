import Web3 from 'web3'
import {abiEvents, eventsHash, CHAIN_ID} from "../globals";
import * as crypto from "crypto";

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.l14.lukso.network"));

export const buyTicket = async (eventId, address, privateKey) => {
    // const privateKey = "0x94ce850ede800f18d26a548c8ee30381ad30efdbbb0d8e8a58404035309a5d96"
    const myUpAddress = address //"0x6b3E2937b1C94A675f7bf6f79a3Cf0237903d4f4"
    console.log("buying ticket", eventId)
    // const universalProfile = new web3.eth.Contract(UniversalProfileContract.abi, myUpAddress);


    const controllerAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    const controllerAddress = controllerAccount.address;

    const eventsContract = new web3.eth.Contract(
        abiEvents,
        eventsHash
    );

    const eventData = await eventsContract.methods.getEventData(eventId).call()
    const eventTransaction = eventsContract.methods.createTicket(eventId);
    console.log("estimating gas", controllerAddress)
    const gas = await eventTransaction.estimateGas({from: controllerAddress, value: eventData['2']});
    console.log("estimated gas: ", gas)
    const gasPrice = await web3.eth.getGasPrice();
    const data = eventTransaction.encodeABI();
    const nonce = await web3.eth.getTransactionCount(controllerAddress);
    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: eventsContract.options.address,
            from: controllerAddress,
            data,
            value: eventData['2'],
            gas: gas,
            gasPrice,
            nonce,
            chainId: CHAIN_ID
        },
        privateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    await web3.eth.getTransactionReceipt(receipt.transactionHash, () => {
        console.log("Sent contract")
    })
    console.log("receipt",receipt)
    return await getTicketId(eventId, controllerAddress)
}

export async function getTicketId (eventId: string, address: string){
    const eventsContract = new web3.eth.Contract(
        abiEvents,
        eventsHash
    );
    const data = await eventsContract.methods.getTicket(address, eventId).call();
    console.log("ticket id: ", data)
    return data
}