import { NowRequest, NowResponse } from "@vercel/node";
import {createEvent} from "../../service/event_service_relayer";

export default async (req: NowRequest, res: NowResponse) => {
    const { body } = req;
    console.log("Creating event with parameters: ", body)
    const data = await createEvent(body)
    return  res.json( { eventId: data });
};