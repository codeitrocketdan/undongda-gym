import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 프론트엔드가 보낸 데이터 꺼내기
    const { fileName, contentType, folder } = await request.json();
    const authHeader = request.headers.get("Authorization") || "";

    const realBackendUrl = `${process.env.NEXT_PUBLIC_API_URL}/images`;
    const backendResponse = await fetch(realBackendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader,
      },
      // 스웨거 스펙 3개 전달
      body: JSON.stringify({
        fileName,
        contentType, // 예: "image/jpeg", "image/png"
        folder, // 예: "meetings"
      }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { error: `dalaem 백엔드 서버 에러: ${errorText}` },
        { status: backendResponse.status }
      );
    }

    // 백엔드가 준 데이터(presignedUrl, publicUrl) 파싱 후 프론트에 전달
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Next.js API 라우트 에러:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
