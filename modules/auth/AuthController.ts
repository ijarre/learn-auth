import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export const setRefreshToken = (req: NextApiRequest, res: NextApiResponse, token: string) => {
  setCookie("jrt", token, { req, res, httpOnly: true });
};
