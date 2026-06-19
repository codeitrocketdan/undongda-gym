import qs from "qs";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { apiError } from "@/shared/api/apiError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      type: searchParams.get("type") || undefined,
      dateStart: searchParams.get("dateStart") || undefined,
      dateEnd: searchParams.get("dateEnd") || undefined,
      region: searchParams.get("region") || undefined,
      sortBy: searchParams.get("sortBy") ?? "createdAt",
      sortOrder: searchParams.get("sortOrder") ?? "desc",
      size: searchParams.get("size") ?? "10",
      cursor: searchParams.get("cursor") || undefined,
    };

    const queryString = qs.stringify(params, { skipNulls: true });
    const data = await serverFetcher.get(`/favorites?${queryString}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}
