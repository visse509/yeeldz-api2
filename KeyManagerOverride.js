export const keyManagerAbi = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_signedFor',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_nonce',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '_data',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: '_signature',
                type: 'bytes',
            },
        ],
        name: 'executeRelayCall',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'payable',
        type: 'function',
    },
]