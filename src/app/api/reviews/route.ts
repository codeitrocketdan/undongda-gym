import { apiError } from "@/shared/api/apiError";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await serverFetcher.get(`/reviews?${searchParams}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await serverFetcher.post("/reviews", body);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}
