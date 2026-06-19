import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./types";

export function apiError(request: NextRequest, error: unknown) {
  let status = 500;
  let message = "잠시 후 다시 시도해 주세요.";

  if (error instanceof ApiError) {
    status = error.status;
    // 4xx는 클라이언트 에러이므로 상세 메시지 제공
    if (status >= 400 && status < 500) {
      message = error.message;
    }
  }

  console.error(`[${request.method} ${request.nextUrl.pathname}]`, error);
  return NextResponse.json({ message }, { status });
}
