import { NowRequest, NowResponse } from "@vercel/node";
import {getEvents} from "../../service/event_service_nft";

export default async (req: NowRequest, res: NowResponse) => {
    const data = await getEvents()
    return  res.json( data );
};