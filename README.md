## Yeeldz

Hiya Lukso Team! Welcome to Yeeldz the Luskso hackathon submission from [@visse509](https://github.com/visse509) and [@vexkiddy](https://github.com/vexkiddy). Yeeldz is proof of concept app for a new events and NFT ticketing system that would be marketed towards a younger generation of event organisers, artists and creators. It would be used for the discovery of virtual events that occur online or in different metaverses as well buying NFT tickets for traditional physical events. 


## Demo Features
In the online demo which you can find below you can do the following things:

 1. Log in with our test universal profile
 2. Create a new universal profile - be patient this takes a while!
 3. Buy a ticket for an existing event
 4. Create your own event
 5. Buy a ticket for the event you just created
 6. Sell a ticket 
 7. Buy a ticket from the marketplace

## Demo & Video

You can visit a demo of [Yeeldz here](https://yeeldz.vercel.app/), please make sure to view it as a responsive mobile web view in your browser or just make your browser window the size of a mobile phone. Its only been designed with that view in mind and will not look good at desktop sizes!! You can also watch an overview video of all the possible use cases [here](https://youtu.be/ioa0oO5FMPI). 


## Technical Implementation
The front end of the project is totally custom and built in Svelte v3 with the backend being built as a node.js server running on vercel. The interaction with the lukso blockchain is done through a combination of the lukso provided tools, and using the web3 library from the node.js server. We decided to create a mobile first web app purely to demo the idea, ideally this would be a full blown responsive web app with an accompanying mobile app.


## Improvements
- Ideally Yeeldz would also allow the user to transfer & burn any of their tickets on secondary markets. We'd also like to attach special NFT content to tickets that would only get unlocked when the QR code is scanned. In the demo this content is hard coded.
- The tickets could be listed as assets on the Universal Profile, similar to how an NFT would be displayed.
- All the transactions from the frontend are done synchronously, which leads us to need a lot of loading states. This could be changed to an asynchronous solution where executed transactions (creating event, buying a ticket) would show up as they are finished. 
- Currently we are storing the private key and account address directly in localStorage for simplicity. This should be changed so that the private key is obtained through a wallet or some other technique. 
- We'd like to change how we're managaging state in Svelte by using Stores instead of passing loads of props around components.
- We'd also like to leverage Sveltes reactive declarations to update the data in a cleaner way.


## Yeeldz Api Server

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

