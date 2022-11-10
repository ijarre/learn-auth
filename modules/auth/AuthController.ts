import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { fetcher } from "../../shared/fetcher";
import { verify } from "../../shared/jwt";

export const setRefreshToken = (req: NextApiRequest, res: NextApiResponse, token: string) => {
  setCookie("jrt", token, { req, res, httpOnly: true });
};

export const authChecking = async (request: NextRequest) => {
  const accessToken = request.headers.get("authorization");

  const ATSecret = process.env.ACCESS_TOKEN_SECRET;
  if (accessToken) {
    const verified = await verify(accessToken, ATSecret as string).catch((err) => console.warn(err));
    if (verified) {
      return NextResponse.next({ request });
    }
  }

  const refreshToken = request.cookies.get("jrt");
  // if (!refreshToken) return new NextResponse(JSON.stringify({ message: "authentication failed" }), { status: 401, headers: { "content-type": "application/json" } });
  if (!refreshToken) return NextResponse.redirect(new URL("/login", request.url));

  const data = await fetcher("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({
      refreshToken: refreshToken.value,
    }),
    headers: { "content-type": "application/json" },
  });

  if (data["token"]) {
    request.headers.set("Authorization", data["token"]);
    return NextResponse.next({ request });
  }
  return NextResponse.redirect(new URL("/login", request.url));
  // return new NextResponse(JSON.stringify({ message: "authentication failed" }), { status: 401, headers: { "content-type": "application/json" } });
};
