import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await serverFetcher.post("/auth/signup", body, {
      isPublic: true,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "회원가입에 실패했습니다." },
      { status: 500 }
    );
  }
}
