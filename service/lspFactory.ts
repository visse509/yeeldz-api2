import {
  LSPFactory,
} from '@lukso/lsp-factory.js';
import Web3 from 'web3';

import { CHAIN_ID, RPC_URL } from '../globals';

export const deployUp = async (web3: Web3, controllerAddress: string, deployKey: string) => {
  const provider = RPC_URL; // RPC url used to connect to the network
  const chainId = CHAIN_ID; // Chain Id of the network you want to connect to

  const lspFactory = new LSPFactory(provider, {
    deployKey,
    chainId,
  });

  console.log('🚀 Deploying LSP3UniversalProfile contract...');
  const deployedContracts = await lspFactory.LSP3UniversalProfile.deploy({
    controllingAccounts: [controllerAddress], // our key will be controlling our UP in the beginning
    lsp3Profile: {
      name: 'New universal profile',
      description: 'My Cool Universal Profile test',
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

  return deployedContracts.ERC725Account.address;
};
