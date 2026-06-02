import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "로그인에 실패하셨습니다." },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = await res.json();

    // 쿠키 저장
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 15, // 15분
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return NextResponse.json(
      { message: "로그인에 성공하셨습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Network Error", error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
