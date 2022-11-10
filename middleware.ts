import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "./shared/jwt";
import { fetcher } from "./shared/fetcher";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/hello")) {
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
  }
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/api/hello",
//
