import { NowRequest, NowResponse } from "@vercel/node";
import {buyTicket} from "../../../service/ticket_service";

export default async (req: NowRequest, res: NowResponse) => {
    const {eventId} = req.query
    const { body } = req;
    const ticketId = await buyTicket(eventId, body.address, body.privateKey)
    return  res.json( { ticketId: ticketId });
};