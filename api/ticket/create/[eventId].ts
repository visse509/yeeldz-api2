import { NowRequest, NowResponse } from "@vercel/node";
import {buyTicket} from "../../../service/ticket_service_nft";

export default async (req: NowRequest, res: NowResponse) => {
    if (req.method == "OPTIONS") {
        console.log("Returning options method")
        res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    const { body } = req;
    const ticketId = await buyTicket(body)
    return  res.json( { ticketId: ticketId });
};