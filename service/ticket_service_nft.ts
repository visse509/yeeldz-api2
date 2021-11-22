import Web3 from 'web3'
import {eventStoreHash, eventStoreAbi, CHAIN_ID} from "../globals";
import {abi} from "../events_contract";
import * as crypto from "crypto";
import {getEventData, getEvents} from "./event_service_nft";

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.l14.lukso.network"));

export const buyTicket = async (body) => {
    // const privateKey = "0x94ce850ede800f18d26a548c8ee30381ad30efdbbb0d8e8a58404035309a5d96"
    const myUpAddress = body.address //"0x6b3E2937b1C94A675f7bf6f79a3Cf0237903d4f4"
    console.log("buying ticket", body.eventAddress)
    // const universalProfile = new web3.eth.Contract(UniversalProfileContract.abi, myUpAddress);


    const controllerAccount = web3.eth.accounts.privateKeyToAccount(body.privateKey);
    const controllerAddress = controllerAccount.address;

    const eventsContract = new web3.eth.Contract(
        abi,
        body.eventAddress
    );

    const cost = await eventsContract.methods.getCost().call()
    console.log("cost: ", cost)
    const eventTransaction = eventsContract.methods.createTicket(body.address);
    console.log("estimating gas", controllerAddress)
    const gas = await eventTransaction.estimateGas({from: controllerAddress, value: cost });
    console.log("estimated gas: ", gas)
    const gasPrice = await web3.eth.getGasPrice();
    const data = eventTransaction.encodeABI();
    const nonce = await web3.eth.getTransactionCount(controllerAddress);
    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: body.eventAddress,
            from: controllerAddress,
            data,
            value: cost,
            gas: gas,
            gasPrice,
            nonce,
            chainId: CHAIN_ID
        },
        body.privateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    await web3.eth.getTransactionReceipt(receipt.transactionHash, () => {
        console.log("Sent contract")
    })
    console.log("receipt",receipt)
    return await getTicketId(body.eventAddress, body.address)
}

export const getTicketsForAddress = async (upAddress) => {
    const eventStore = new web3.eth.Contract(
        eventStoreAbi,
        eventStoreHash
    );
    const events = await eventStore.methods.getEvents().call();
    console.log(events)
    const ticketId = await getTicketId(events[0], upAddress)
    console.log(ticketId)
    let tickets = []

    for(let event of events) {
        const ticketId = await getTicketId(event, upAddress)
        const eventData = await getEventData(event)
        console.log("ticketId: ", ticketId)
        if (ticketId.length > 0) {
            const ticketData = {
                ticketId: ticketId[0],
                eventId: eventData.eventId,
                title: eventData.eventName,
                date: eventData.date,
                location: eventData.location,
                img: eventData.img
            }
            console.log("ticket data", ticketData)
            tickets.push(ticketData)
        }
    }
    console.log(tickets)
    return tickets;
}

export async function getTicketId (eventAddress: string, address: string){
    const eventsContract = new web3.eth.Contract(
        abi,
        eventAddress
    );
    console.log("address: ", address)
    const data = await eventsContract.methods.tokenIdsOf(address).call();
    console.log("ticket id: ", data)
    return data
}