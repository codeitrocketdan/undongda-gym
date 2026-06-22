import { PublicUserDTO } from "@/features/my-page/types";
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
    const data = await serverFetcher.get<PublicUserDTO>(`/users/${userId}`, {
      isPublic: true,
    });
    const publicUser: PublicUserDTO = {
      id: data.id,
      teamId: data.teamId,
      email: data.email,
      name: data.name,
      companyName: data.companyName,
      image: data.image,
    };
    return NextResponse.json(publicUser);
  } catch (error) {
    return apiError(request, error);
  }
}
