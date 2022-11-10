import { deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export default function Logout(req: NextApiRequest, res: NextApiResponse) {
  deleteCookie("jrt", { req, res });
  return res.status(200).json({ message: "success logout" });
}
