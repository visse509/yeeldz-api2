import {
    LSPFactory,
} from '@lukso/lsp-factory.js';
import Web3 from 'web3';

import {CHAIN_ID, RPC_URL} from '../globals';
import * as fs from "fs";
import {Blob} from 'node:buffer';

function blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export const deployUp = async (web3: Web3, body) => {
    const provider = RPC_URL;
    const chainId = CHAIN_ID;

    const controllerAddress = body.address
    const privateKey = body.privateKey as string

    let imgFile;
    try {
        imgFile = fs.readFileSync(body.img)
    } catch (err) {
        console.log(err)
    }

    const lspFactory = new LSPFactory(provider, privateKey);

    const deployedContracts = await lspFactory.LSP3UniversalProfile.deploy({
        controllingAccounts: [controllerAddress],
        lsp3Profile: {
            name: body.name,
            description: body.description,
            profileImage: [imgFile], // got some Image uploaded?
            backgroundImage: [imgFile],
            tags: ['Public Profile'],
            links: [
                {
                    title: 'My Website',
                    url: 'http://my-website.com',
                },
            ],
        },
    });

    return {
        upAddress: deployedContracts.ERC725Account.address,
        address: controllerAddress,
        privateKey: privateKey
    }
};
