import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  const { meetingId } = await params;
  const data = await serverFetcher.post(`/meetings/${meetingId}/favorites`);
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  const { meetingId } = await params;
  await serverFetcher.delete(`/meetings/${meetingId}/favorites`);
  return new NextResponse(null, { status: 204 });
}
