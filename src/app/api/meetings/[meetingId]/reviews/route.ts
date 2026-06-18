import { Review } from "@/features/dagym-detail/model/types";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
import { NextRequest, NextResponse } from "next/server";

interface BackendReviewResponse {
  data: Review[];
  nextCursor: string | null;
  hasMore: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  const { meetingId } = await params;
  const { searchParams } = new URL(request.url);

  const cursor = searchParams.get("cursor") || "";

  try {
    const backendData = await serverFetcher.get<BackendReviewResponse>(
      `/meetings/${meetingId}/reviews?${cursor}`,
      { isPublic: true }
    );

    return NextResponse.json({
      data: backendData.data,
      nextCursor: backendData.nextCursor,
      hasMore: backendData.hasMore,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
