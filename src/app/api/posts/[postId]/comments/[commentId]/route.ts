import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const { postId, commentId } = await params;
    const body = await request.json();
    const data = await serverFetcher.patch(
      `/posts/${postId}/comments/${commentId}`,
      body
    );
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const { postId, commentId } = await params;
    await serverFetcher.delete(`/posts/${postId}/comments/${commentId}`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(request, error);
  }
}
