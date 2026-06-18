import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./types";

export function apiError(request: NextRequest, error: unknown) {
  let status = 500;

  if (error instanceof ApiError) {
    status = error.status;
  }

  console.error(`[${request.method} ${request.nextUrl.pathname}]`, error);
  return NextResponse.json(
    { message: "잠시 후 다시 시도해 주세요." },
    { status }
  );
}
