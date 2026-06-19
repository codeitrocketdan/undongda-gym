import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;
    const data = await serverFetcher.post(`/meetings/${meetingId}/join`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;
    await serverFetcher.delete(`/meetings/${meetingId}/join`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(request, error);
  }
}
