import { NowRequest, NowResponse } from "@vercel/node";
import {getTicketsForAddress} from "../../service/ticket_service_nft";

export default async (req: NowRequest, res: NowResponse) => {
    if (req.method == "OPTIONS") {
        console.log("Returning options method")
        res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    const {upAddress} = req.query
    const ticketData = await getTicketsForAddress(upAddress)
    return  res.json( ticketData);
};