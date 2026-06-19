import { apiError } from "@/shared/api/apiError";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;
    const body = await request.json();
    const data = await serverFetcher.post(
      `/meetings/${meetingId}/reviews`,
      body
    );
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}
