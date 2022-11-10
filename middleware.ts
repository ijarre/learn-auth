import type { NextRequest } from "next/server";
import { authChecking } from "./modules/auth/AuthController";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/hello")) {
    return await authChecking(request);
  }

  if (request.nextUrl.pathname.startsWith("/main")) {
    return await authChecking(request);
  }
}
