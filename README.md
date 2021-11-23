## Yeeldz Api Server

Please see https://github.com/vexkiddy/yeeldz for more details

The api does all the communication to the Lukso network.
1. Creating profile, getting profile data
2. Creating event, getting all events with data
3. Buying ticket, getting all ticket data

It is using the LSPFactory and web3 to interact with the lukso blockchain.

Included is also the smart contracts used for the project,
note that smart contracts were compiled/deployed on remix.

install dependencies:
    
    npm install

Start with: 
    
    yarn start

## Technical overview

When creating an event, a new smart contract is deployed to the network.
The smart contract for the Event is inheriting the LSP8IdentifiableDigitalAssetCore smart contract.

The address for each smart contract that represents an event is then stored in a seperated smart contract (ticketStore.sol)
This is to help us keep track of created events.

