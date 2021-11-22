import fetch from 'cross-fetch'
global.fetch = fetch
export const RPC_URL = 'https://rpc.l14.lukso.network';
export const CHAIN_ID = 22;
export const RELAYER_URL = 'https://relayer.lukso.network/api/v1/execute'

export const eventStoreHash = '0xB275309ac89dfEe4a15B0b69238E9825Cfca5cAA'
export const eventStoreAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "eventId",
                "type": "address"
            }
        ],
        "name": "addEvent",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "eventList",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getEvents",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
