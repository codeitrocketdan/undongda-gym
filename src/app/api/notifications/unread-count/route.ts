import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await serverFetcher.get("/notifications/unread-count");
  return NextResponse.json(data);
}
