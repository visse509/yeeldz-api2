import { NowRequest, NowResponse } from "@vercel/node";
import {getProfileData} from "../../service/profile_service";

export default async (req: NowRequest, res: NowResponse) => {
    const {address} = req.query
    return res.json(await getProfileData(address as string))
};