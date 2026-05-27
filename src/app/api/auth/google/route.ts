import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ message: "OAuth 로그인 실패" }, { status: 401 });
    }

    const { accessToken, refreshToken } = await res.json();

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ message: "OAuth 구글 로그인 성공" }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "구글 로그인에 실패했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
