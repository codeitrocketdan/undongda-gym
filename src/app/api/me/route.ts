import { bffFetch } from "@/shared/utils/bffFetch";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 공통 래퍼 함수 사용
    const res = await bffFetch("/users/me");

    if (!res.ok) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await res.json();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
