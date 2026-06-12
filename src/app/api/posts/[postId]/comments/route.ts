import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

// TODO: serverFetcher 머지시 변경
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const data = await serverFetcher(`/posts/${postId}/comments`);
  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const body = await request.json();
  const data = await serverFetcher(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(data);
}
