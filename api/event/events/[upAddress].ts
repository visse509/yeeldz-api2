import { NowRequest, NowResponse } from "@vercel/node";
import {getEventForUser} from "../../../service/event_service_nft";

export default async (req: NowRequest, res: NowResponse) => {
    const {upAddress} = req.query
    const ownedEvents = await getEventForUser(upAddress)
    return  res.json( ownedEvents);
};