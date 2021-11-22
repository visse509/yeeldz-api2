import Web3 from 'web3'
import {CHAIN_ID, RPC_URL, eventStoreHash, eventStoreAbi} from "../globals";
import {abi, readByteCodeFile} from "../events_contract"
import * as crypto from "crypto";

const web3 = new Web3(RPC_URL)

export const createEvent = async (body) => {

    const myUpAddress = body.address //"0x6b3E2937b1C94A675f7bf6f79a3Cf0237903d4f4"
    console.log("creating event: ", body)
    // const universalProfile = new web3.eth.Contract(UniversalProfileContract.abi, myUpAddress);


    const controllerAccount = web3.eth.accounts.privateKeyToAccount(body.privateKey);
    const controllerAddress = controllerAccount.address;

    const eventContract = new web3.eth.Contract(abi);

    // Create Constructor Tx
    let byteCode = await readByteCodeFile()

    const eventContractTransaction = eventContract.deploy({
        data: byteCode.object,
        arguments: ["TicketContract", "TKT",
            body.address,
            body.price,
            body.totalTickets,
            body.eventName,
            body.description,
            body.location,
            body.date,
            body.img],
    });
    const gas = await eventContractTransaction.estimateGas()
    console.log("estimated gas: ", gas)
    console.log("estimated nonce: ", await web3.eth.getTransactionCount(controllerAddress))
    // Sign Transacation and Send
    const createEventTransaction = await web3.eth.accounts.signTransaction(
        {
            data: eventContractTransaction.encodeABI(),
            nonce: await web3.eth.getTransactionCount(controllerAddress),
            gas: gas,
        },
        body.privateKey
    );
    console.log("signed tx: ", createEventTransaction.transactionHash)
    // // Send Tx and Wait for Receipt
    const createReceipt = await web3.eth.sendSignedTransaction(
        createEventTransaction.rawTransaction
    );
    console.log(
        `Contract deployed at address: ${createReceipt.contractAddress}`
    );

    await addToTicketStore(controllerAddress, body.privateKey, createReceipt.contractAddress)

    return createReceipt.contractAddress;
}

async function addToTicketStore(controllerAddress, privateKey, eventAddress) {

    const eventStore = new web3.eth.Contract(
        eventStoreAbi,
        eventStoreHash
    );

    const eventTransaction = eventStore.methods.addEvent(eventAddress);
    const gas = await eventTransaction.estimateGas({from: controllerAddress});
    const gasPrice = await web3.eth.getGasPrice();
    const data = eventTransaction.encodeABI();
    const nonce = await web3.eth.getTransactionCount(controllerAddress);

    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: eventStore.options.address,
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
    console.log("receipt", receipt)
}

export const getEvents = async () => {
    let result = []
    console.log("Getting all events")
    const eventsStoreContract = new web3.eth.Contract(
        eventStoreAbi,
        eventStoreHash
    );

    const events = await eventsStoreContract.methods.getEvents().call();
    console.log("events: ", events)

    for (let eventId of events) {
        console.log("data for eventId", eventId)
        const eventsContract = new web3.eth.Contract(
            abi,
            eventId
        );
        const eventData = await eventsContract.methods.getEventData().call()
        result.push({
            eventId,
            ticketBought: eventData['0'],
            ticketTotal: eventData['1'],
            ticketCost: eventData['2'],
            eventName: eventData['3'],
            description: eventData['4'],
            location: eventData['5'],
            date: eventData['6'],
            img: eventData['7']
        })
        console.log("data for eventId", eventId, eventData)
    }
    return result;

}

export const getEventData = async (eventAddress) => {
    const eventsContract = new web3.eth.Contract(
        abi,
        eventAddress
    );
    const eventData = await eventsContract.methods.getEventData().call()
    return {
        eventAddress,
        ticketBought: eventData['0'],
        ticketTotal: eventData['1'],
        ticketCost: eventData['2'],
        eventName: eventData['3'],
        description: eventData['4'],
        location: eventData['5'],
        date: eventData['6'],
        img: eventData['7']
    }
}

export const getEventForUser = async (upAddress) => {
    const eventsStoreContract = new web3.eth.Contract(
        eventStoreAbi,
        eventStoreHash
    );
    let ownedEvents = []
    const events = await eventsStoreContract.methods.getEvents().call();
    console.log("events: ", events)
    for(let eventId of events) {
        const eventsContract = new web3.eth.Contract(
            abi,
            eventId
        );
        const owner = await eventsContract.methods.owner().call()
        if(owner === upAddress) {
            const eventData = await getEventData(eventId)
            ownedEvents.push({
                eventId: eventId,
                date: eventData.date,
                title: eventData.eventName,
                location: eventData.location,
                price: eventData.ticketCost
            })
        }
    }
    return ownedEvents;
}