import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    const kakaoTokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
        code,
      }),
    });

    // 카카오에서 accessToekn 발급
    const { access_token } = await kakaoTokenRes.json();

    if (!kakaoTokenRes.ok) {
      return NextResponse.json({ message: "카카오 토큰 발급 실패" }, { status: 401 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/kakao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: access_token,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          message: "백엔드 OAuth 로그인 실패",
        },
        {
          status: 401,
        }
      );
    }

    // 백엔드에서 토큰 발급
    const { accessToken, refreshToken } = await res.json();

    // 쿠키 저장
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
    return NextResponse.json({ message: "카카오 로그인 성공" }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "카카오 로그인에 실패했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}
