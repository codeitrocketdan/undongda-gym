import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { meetingId } = await params;

    const data = await serverFetcher.post(`/meetings/${meetingId}/join`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("모임 참여 실패", error);

    return NextResponse.json(
      {
        message: "모임 참여 실패",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const { meetingId } = await params;

  const data = await serverFetcher.delete(`/meetings/${meetingId}/join`);

  return NextResponse.json(data);
}
