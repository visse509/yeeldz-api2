import {
    LSPFactory,
} from '@lukso/lsp-factory.js';
import Web3 from 'web3';

import {CHAIN_ID, RPC_URL} from '../globals';

export const deployUp = async (web3: Web3, body) => {
    const provider = RPC_URL;
    const chainId = CHAIN_ID;

    const controllerAddress = body.address
    const privateKey = body.privateKey as string

    console.log("privateKey: ", privateKey)
    console.log("controllerAddress: ", controllerAddress)


    const lspFactory = new LSPFactory(provider, privateKey);

    const deployedContracts = await lspFactory.LSP3UniversalProfile.deploy({
        controllingAccounts: [controllerAddress],
        lsp3Profile: {
            name: body.name,
            description: body.description,
            //   profileImage: [fileBlob], // got some Image uploaded?
            backgroundImage: [],
            tags: ['Public Profile'],
            links: [
                {
                    title: 'My Website',
                    url: 'http://my-website.com',
                },
            ],
        },
    });

    console.log(`✅ Deployment and configuration successful`);
    console.log('Contracts:', deployedContracts);

    return {
        upAddress: deployedContracts.ERC725Account.address,
        address: controllerAddress,
        privateKey: privateKey
    }
};
