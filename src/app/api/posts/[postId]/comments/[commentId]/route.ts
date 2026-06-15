import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

// TODO: serverFetcher 머지시 변경
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  const { postId, commentId } = await params;
  const body = await request.json();
  const data = await serverFetcher(`/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return NextResponse.json(data);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  const { postId, commentId } = await params;
  await serverFetcher(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });
  return new NextResponse(null, { status: 204 });
}
