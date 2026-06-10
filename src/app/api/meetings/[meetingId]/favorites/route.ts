import { serverFetcher } from "@/shared/lib/auth/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  const { meetingId } = await params;
  const data = await serverFetcher(`/meetings/${meetingId}/favorites`, {
    method: "POST",
  });
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  const { meetingId } = await params;
  await serverFetcher(`/meetings/${meetingId}/favorites`, { method: "DELETE" });
  return new NextResponse(null, { status: 204 });
}
