import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const data = await serverFetcher.get(`/posts/${postId}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const body = await request.json();
    const data = await serverFetcher.patch(`/posts/${postId}`, body);
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
    await serverFetcher.delete(`/posts/${postId}`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(request, error);
  }
}
