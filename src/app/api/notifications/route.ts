import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await serverFetcher.get("/notifications");
  return NextResponse.json(data);
}

export async function DELETE() {
  await serverFetcher.delete("/notifications");
  return new NextResponse(null, { status: 204 });
}
