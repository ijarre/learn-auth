import { sign } from "../../shared/jwt";

export const createAccessToken = (userId: number) => {
  return sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    7 * 60 //7 minutes
  );
};

export const createRefreshToken = (userId: number) => {
  return sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    60 * 60 * 24 * 7 // 7 day
  );
};
