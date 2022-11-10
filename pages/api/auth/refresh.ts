import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { createAccessToken, createRefreshToken } from "../../../modules/auth";
import { setRefreshToken } from "../../../modules/auth/AuthController";
import { REFRESH_TOKEN_SECRET } from "../../../shared/constant";
import { verify } from "../../../shared/jwt";
export default async function Refresh(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const bodySchema = z.object({
      refreshToken: z.string(),
    });

    const parsed = bodySchema.safeParse(req.body);

    if (parsed.success) {
      if (!REFRESH_TOKEN_SECRET) return res.status(500).json({ message: "secret missing" });
      const verified = await verify(parsed.data.refreshToken, REFRESH_TOKEN_SECRET).catch(() => {
        return res.status(403).json({ message: "invalid refresh token" });
      });
      if (verified) {
        if (typeof verified["userId"] === "number") {
          setRefreshToken(req, res, await createRefreshToken(verified["userId"]));
          return res.status(200).json({ success: true, token: await createAccessToken(verified["userId"]) });
        }
      }
    }
  }
}
