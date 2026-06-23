import { apiError } from "@/shared/api/apiError";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 프론트엔드가 보낸 데이터 꺼내기 (fileName, contentType, folder)
    const body = await request.json();
    const data = await serverFetcher.post("/images", body);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}
