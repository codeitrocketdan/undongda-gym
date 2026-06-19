import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: Props) {
  const { meetingId } = await params;

  const data = await serverFetcher.get(`/meetings/${meetingId}`);

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { meetingId } = await params;

    const body = await request.json();

    const data = await serverFetcher.patch(`/meetings/${meetingId}`, body);

    return NextResponse.json(data);
  } catch (error) {
    console.error("모임 수정 실패", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.status,
        }
      );
    }
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { meetingId } = await params;

    const data = await serverFetcher.delete(`/meetings/${meetingId}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("모임 삭제 실패", error);

    return NextResponse.json(
      {
        message: "모임 삭제에 실패했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
