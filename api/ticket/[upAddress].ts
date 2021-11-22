import { NowRequest, NowResponse } from "@vercel/node";
import {getTicketsForAddress} from "../../service/ticket_service_nft";

export default async (req: NowRequest, res: NowResponse) => {
    const {upAddress} = req.query
    const ticketData = await getTicketsForAddress(upAddress)
    return  res.json( ticketData);
};