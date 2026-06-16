import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

// TODO: serverFetcher 머지시 변경
export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const data = await serverFetcher(`/posts/${postId}/like`, { method: "POST" });
  return NextResponse.json(data);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  await serverFetcher(`/posts/${postId}/like`, { method: "DELETE" });
  return new NextResponse(null, { status: 204 });
}
