import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextResponse } from "next/server";

export async function PUT() {
  await serverFetcher.put("/notifications/read-all", {});
  return new NextResponse(null, { status: 204 });
}
