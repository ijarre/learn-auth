import jwt from "jsonwebtoken";

export const createAccessToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "10m" });
};

export const createRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
};
