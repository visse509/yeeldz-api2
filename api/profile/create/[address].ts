import { NowRequest, NowResponse } from "@vercel/node";
import {deployUp} from "../../../service/lspFactory";
import Web3 from 'web3'
import {RPC_URL} from '../../../globals'

export default async (req: NowRequest, res: NowResponse) => {
    const web3 = new Web3(RPC_URL)
    const {address} = req.query
    const {privateKey} = req.query
    return res.json(await deployUp(web3, address as string, privateKey as string))
};