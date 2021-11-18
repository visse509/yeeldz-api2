import Web3 from 'web3'
import {abiEvents, eventsHash, CHAIN_ID} from "../globals";
import * as crypto from "crypto";

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.l14.lukso.network"));

const expectedBlockTime = 1000;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const createEvent = async (body) => {
    // const privateKey = "0x94ce850ede800f18d26a548c8ee30381ad30efdbbb0d8e8a58404035309a5d96"

    const myUpAddress = body.address //"0x6b3E2937b1C94A675f7bf6f79a3Cf0237903d4f4"
    // const universalProfile = new web3.eth.Contract(UniversalProfileContract.abi, myUpAddress);
    const privateKey = body.privateKey
    console.log("creating event", myUpAddress, privateKey)
    const controllerAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    const controllerAddress = controllerAccount.address;

    console.log("controller address", controllerAddress)

    const eventsContract = new web3.eth.Contract(
        abiEvents,
        eventsHash
    );

    const traceId = crypto.randomUUID()

    const eventTransaction = eventsContract.methods.createEvent(traceId, body.ticketCost, body.ticketTotal);
    const gas = await eventTransaction.estimateGas({from: controllerAddress});
    const gasPrice = await web3.eth.getGasPrice();
    const data = eventTransaction.encodeABI();
    const nonce = await web3.eth.getTransactionCount(controllerAddress);

    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: eventsContract.options.address,
            from: controllerAddress,
            data,
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
    return await getEventId(traceId)
}

async function getEventId (traceId: string){
    const eventsContract = new web3.eth.Contract(
        abiEvents,
        eventsHash
    );
    return await eventsContract.methods.getEventId(traceId).call();
}

export const getEvents = async () => {
    let result = []
    console.log("Getting all events")
    const eventsContract = new web3.eth.Contract(
        abiEvents,
        eventsHash
    );
    const events = await eventsContract.methods.getAllEvents().call();
    console.log("events: ",events)
    // events.forEach( async (event) => {
    //     const eventData = await eventsContract.methods.getEventData(event).call()
    //     console.log("data for eventId", event, eventData)
    // })
    for (let eventId of events) {
        console.log("data for eventId", eventId)
        const eventData = await eventsContract.methods.getEventData(eventId).call()
        result.push({
            eventId,
            ticketBought: eventData['0'],
            ticketTotal: eventData['1'],
            ticketCost: eventData['2']
        })
        console.log("data for eventId", eventId, eventData)
    }
    return result;

}