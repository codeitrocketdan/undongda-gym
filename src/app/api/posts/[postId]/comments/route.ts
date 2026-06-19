import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const data = await serverFetcher.get(`/posts/${postId}/comments`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const body = await request.json();
    const data = await serverFetcher.post(`/posts/${postId}/comments`, body);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}
