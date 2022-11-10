import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../../../modules/auth";
import { setRefreshToken } from "../../../modules/auth/AuthController";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function LoginHandler(req: NextApiRequest, res: NextApiResponse) {
  const loginSchema = z.object({
    usernameOrEmail: z.string(),
    password: z.string(),
  });

  const isEmail = (email: string) => {
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
      return true;
    } catch {
      return false;
    }
  };

  if (req.method === "POST") {
    const validatedBody = loginSchema.safeParse(req.body);

    if (!validatedBody.success) {
      return res.status(400).json({ errors: JSON.parse(validatedBody.error.message) });
    }
    const { usernameOrEmail, password } = validatedBody.data;
    let email, username;
    if (isEmail(usernameOrEmail)) {
      email = usernameOrEmail;
    } else {
      username = usernameOrEmail;
    }
    const user = await prisma.user.findFirst({ where: { email, username } });

    if (!user) {
      return res.status(400).json({ message: "cannot find user" });
    }

    const resolvedPassword = await bcrypt.compare(password, user.password);
    if (!resolvedPassword) {
      return res.status(400).json({ message: "wrong password" });
    }
    const refreshToken = await createRefreshToken(user.id);
    setRefreshToken(req, res, refreshToken);
    setCookie("mbb", user.id, { req, res });
    return res.status(200).json({ message: "success login", token: await createAccessToken(user.id) });
  }
}
