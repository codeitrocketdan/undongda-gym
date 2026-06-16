import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  const { postId, commentId } = await params;
  const body = await request.json();
  const data = await serverFetcher.patch(
    `/posts/${postId}/comments/${commentId}`,
    body
  );
  return NextResponse.json(data);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  const { postId, commentId } = await params;
  await serverFetcher.delete(`/posts/${postId}/comments/${commentId}`);
  return new NextResponse(null, { status: 204 });
}
