import { NowRequest, NowResponse } from "@vercel/node";
import {deployUp} from "../../service/lspFactory";
import Web3 from 'web3'
import {RPC_URL} from '../../globals'
// import formidable from 'formidable';
import * as fs from "fs";
import * as path from "path";

export default async (req: NowRequest, res: NowResponse) => {
    const web3 = new Web3(RPC_URL)
    const { body } = req;
    return res.json(await deployUp(web3, body))
};