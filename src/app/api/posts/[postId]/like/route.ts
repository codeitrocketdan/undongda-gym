import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const data = await serverFetcher.post(`/posts/${postId}/like`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    await serverFetcher.delete(`/posts/${postId}/like`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(request, error);
  }
}
