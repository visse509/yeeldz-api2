import { NowRequest, NowResponse } from "@vercel/node";
import {createEvent} from "../../service/event_service_nft";

export default async (req: NowRequest, res: NowResponse) => {
    if (req.method == "OPTIONS") {
        console.log("Returning options method")
        res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    const { body } = req;
    console.log("Creating event with parameters: ", body)
    const data = await createEvent(body)
    return  res.json( { eventId: data });
};