import { MeetingWithHostDTO } from "@/features/dagym/types";

// Swagger Favorite 스키마 1대1 대응 DTO
export interface FavoriteDTO {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  createdAt: string | null;
}

// Swagger FavoriteWithMeeting 스키마 1대1 대응 DTO
export interface FavoriteWithMeetingDTO extends FavoriteDTO {
  meeting: MeetingWithHostDTO;
}

// GET /{teamId}/favorites 응답
export interface FavoriteListResponse {
  data: FavoriteWithMeetingDTO[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
  currentOffset?: number;
  limit?: number;
}
