import fetch from 'cross-fetch'
global.fetch = fetch
export const RPC_URL = 'https://rpc.l14.lukso.network';
export const CHAIN_ID = 22;
export const RELAYER_URL = 'https://relayer.lukso.network/api/v1/execute'


export const eventStoreHash = '0xB4A7EbfC6E0513a7aCc0C39B4F6F2B44e4FFD11D'
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
