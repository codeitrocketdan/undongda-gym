import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await serverFetcher.get(`/posts?${searchParams.toString()}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { image, ...rest } = await request.json();
    const body = image ? { ...rest, image } : rest;
    const data = await serverFetcher.post("/posts", body);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}
