import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await serverFetcher.get(`/meetings?${searchParams}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}

export async function POST(request: Request) {
  try {
    const bodyData = await request.json();
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get("accessToken");
    const accessToken = tokenObj ? tokenObj.value : "";

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meetings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`, // 백엔드에게 헤더 토큰 패스
        },
        body: JSON.stringify(bodyData),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error("❌ 진짜 백엔드 서버가 보낸 에러 상세:", errorData);
      return NextResponse.json(
        {
          error: "dalaem 백엔드 서버에서 요청을 거부했습니다.",
          details: errorData,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Next.js meetings 라우트 에러:", error);
    return NextResponse.json(
      { error: "Next.js 서버 내부 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
