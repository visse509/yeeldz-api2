import { NowRequest, NowResponse } from "@vercel/node";
import {buyTicket} from "../../service/ticket_service_nft";

export default async (req: NowRequest, res: NowResponse) => {
    const { body } = req;
    const ticketId = await buyTicket(body)
    return  res.json( { ticketId: ticketId });
};