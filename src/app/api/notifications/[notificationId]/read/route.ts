import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  _: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const { notificationId } = await params;
  await serverFetcher.put(`/notifications/${notificationId}/read`, {});
  return new NextResponse(null, { status: 204 });
}
