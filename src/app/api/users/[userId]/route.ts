import { apiError } from "@/shared/api/apiError";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { userId } = await params;
    const data = await serverFetcher.get(`/users/${userId}`, {
      isPublic: true,
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(request, error);
  }
}
