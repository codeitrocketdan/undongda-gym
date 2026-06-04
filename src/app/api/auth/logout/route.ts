import { post } from "@/shared/lib/fetch";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    const res = await post(`/auth/logout`, { refreshToken });

    if (!res.ok) {
      return NextResponse.json({ message: "로그아웃에 실패하셨습니다." }, { status: 401 });
    }

    return NextResponse.json({ message: "로그아웃에 성공하셨습니다." }, { status: 200 });
  } catch (error) {
    console.error("Network Error", error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
