import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { meetingId } = await params;

    const response = await serverFetcher.get(
      `/meetings/${meetingId}/participants`,
      {
        isPublic: true,
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "참여자 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
