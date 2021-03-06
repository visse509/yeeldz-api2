import { NowRequest, NowResponse } from "@vercel/node";
import {deployUp} from "../../service/lspFactory";
import Web3 from 'web3'
import {RPC_URL} from '../../globals'
import formidable from 'formidable'
import * as fs from "fs";

export default async (req: NowRequest, res: NowResponse) => {
    if (req.method == "OPTIONS") {
        console.log("Returning options method")
        res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    const web3 = new Web3(RPC_URL)
    let form = new formidable.IncomingForm();
    let body = {
        img: undefined
    }
    form.parse(req, async function (err, fields, files) {
        console.log(fields)
        let oldPath = files.img.filepath;
        let imgFile;
        try {
            imgFile = fs.readFileSync(oldPath)
        } catch (err) {
            console.log(err)
        }

        body = {...fields};
        const profileData = await deployUp(web3, body, imgFile)
        return res.json(profileData)
    })
};