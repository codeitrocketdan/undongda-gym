import { apiError } from "@/shared/api/apiError";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const data = await serverFetcher.delete(`/reviews/${reviewId}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}
