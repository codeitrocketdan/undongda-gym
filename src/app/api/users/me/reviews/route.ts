import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = await serverFetcher.get(`/users/me/reviews?${searchParams}`);
  return NextResponse.json(data);
}
