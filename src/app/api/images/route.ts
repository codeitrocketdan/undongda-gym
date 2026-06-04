import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 프론트엔드가 보낸 데이터 꺼내기
    const { fileName, contentType, folder } = await request.json();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/images`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        // 스웨거 스펙 3개 전달
        body: JSON.stringify({
          fileName,
          contentType, // 예: "image/jpeg", "image/png"
          folder, // 예: "meetings"
        }),
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "이미지 업로드 요청 처리 중 오류가 발생했습니다." },
        { status: backendResponse.status }
      );
    }

    // 백엔드가 준 데이터(presignedUrl, publicUrl) 파싱 후 프론트에 전달
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Next.js API 라우트 에러:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
