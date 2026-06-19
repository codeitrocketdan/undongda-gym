import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { meetingId } = await params;
    const data = await serverFetcher.get(`/meetings/${meetingId}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { meetingId } = await params;
    const body = await request.json();
    const data = await serverFetcher.patch(`/meetings/${meetingId}`, body);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { meetingId } = await params;
    await serverFetcher.delete(`/meetings/${meetingId}`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(request, error);
  }
}
