import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import bcrypt from "bcrypt";
import { createRefreshToken } from "../../../modules/auth";
import { setRefreshToken } from "../../../modules/auth/AuthController";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function CreateUser(req: NextApiRequest, res: NextApiResponse) {
  const createUserSchema = z.object({
    username: z.string(),
    email: z.string().email({ message: "invalid email address" }),
    password: z.string(),
  });

  if (req.method === "POST") {
    const validatedBody = createUserSchema.safeParse(req.body);
    if (!validatedBody.success) {
      return res.status(400).json({ message: JSON.parse(validatedBody.error.message) });
    }
    const { email, password, username } = validatedBody.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    if (newUser) {
      const refreshToken = await createRefreshToken(newUser.id);
      setRefreshToken(req, res, refreshToken);
      setCookie("mbb", newUser.id, { req, res });
      return res.status(200).json({ message: "success creating user" });
    }
    return res.status(500).json({ message: "something went wrong" });
  }
}
