import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meetings`, {
    method: "POST",
    body: formData,
    headers: {
      // 필요한 경우 백엔드 전용 인증 토큰(Secret Key) 등
    },
  });

  const data = await backendResponse.json();
  return NextResponse.json(data);
}
