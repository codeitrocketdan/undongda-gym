import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  try {
    const data = await serverFetcher.get(`/users/me/meetings?${searchParams}`);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { message: "요청에 실패했습니다." },
      { status: 500 }
    );
  }
}
