API server for yeeldz, based on vercel.

The api does all the communication to the Lukso network.
1. Creating profile, getting profile data
2. Creating event, getting all events with data
3. Buying ticket, getting all ticket data

Included is also the smart contracts used for the project,
note that smart contracts were compiled/deployed on remix.

Start with yarn start

When creating an event, a new smart contract is deployed to the network.
The smart contract for the Event is inheriting the LSP8IdentifiableDigitalAssetCore smart contract.
