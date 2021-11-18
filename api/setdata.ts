import { NowRequest, NowResponse } from "@vercel/node";
import {setData} from "../service/universalprofile_service";

export default (req: NowRequest, res: NowResponse) => {
    setData().then()
    return res.json({ message: "Hello World" });
};