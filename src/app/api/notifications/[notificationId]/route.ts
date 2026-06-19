import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const { notificationId } = await params;
  await serverFetcher.delete(`/notifications/${notificationId}`);
  return new NextResponse(null, { status: 204 });
}
