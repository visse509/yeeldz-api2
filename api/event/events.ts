import { NowRequest, NowResponse } from "@vercel/node";
import {getEvents} from "../../service/event_service_nft";

export default async (req: NowRequest, res: NowResponse) => {
    if (req.method == "OPTIONS") {
        console.log("Returning options method")
        res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    const data = await getEvents()
    return  res.json( data );
};