import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = await serverFetcher(`/users/me/reviews?${searchParams}`);
  return NextResponse.json(data);
}
