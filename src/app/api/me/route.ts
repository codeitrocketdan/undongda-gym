import { serverFetch } from "@/shared/api/serverFetch";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await serverFetch("/users/me");

    if (!res.ok) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await res.json();

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "에러" }, { status: 500 });
  }
}
