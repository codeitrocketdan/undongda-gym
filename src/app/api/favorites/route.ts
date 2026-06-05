import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? "";

  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();
  if (searchParams.get("type")) params.set("type", searchParams.get("type")!);
  if (searchParams.get("region")) params.set("region", searchParams.get("region")!);
  params.set("sortBy", searchParams.get("sortBy") ?? "createdAt");
  params.set("sortOrder", searchParams.get("sortOrder") ?? "desc");
  params.set("size", searchParams.get("size") ?? "10");
  if (searchParams.get("cursor")) params.set("cursor", searchParams.get("cursor")!);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/favorites?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
