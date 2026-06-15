import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

// TODO: serverFetcher 머지시 변경
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const data = await serverFetcher(`/posts/${postId}`);
  return NextResponse.json(data);
}
