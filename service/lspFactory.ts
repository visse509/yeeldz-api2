import {
    LSPFactory,
} from '@lukso/lsp-factory.js';
import Web3 from 'web3';

import {CHAIN_ID, RPC_URL} from '../globals';
import * as fs from "fs";

export const deployUp = async (web3: Web3, body, imgFile) => {
    const provider = RPC_URL;
    const chainId = CHAIN_ID;

    const controllerAddress = body.address
    const privateKey = body.privateKey as string


    const lspFactory = new LSPFactory(provider, privateKey);
    console.log("deploying contract")
    const deployedContracts = await lspFactory.LSP3UniversalProfile.deploy({
        controllingAccounts: [controllerAddress],
        lsp3Profile: {
            name: body.name,
            description: body.description,
            profileImage: [imgFile], // got some Image uploaded?
            tags: ['Public Profile'],
            links: [
                {
                    title: 'My Website',
                    url: 'http://my-website.com',
                },
            ],
        },
    });
    console.log("Deployed contract: ", deployedContracts)
    return {
        upAddress: deployedContracts.ERC725Account.address,
        address: controllerAddress,
        privateKey: privateKey
    }
};
