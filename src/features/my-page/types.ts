import { MeetingWithHostDTO } from "@/features/dagym/types";

// GET /users/me 응답
export interface UserProfileDTO {
  id: number;
  teamId: string;
  email: string;
  name: string;
  companyName: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// GET /meetings/joined 아이템 (MeetingWithHost 확장)
export interface JoinedMeetingDTO extends MeetingWithHostDTO {
  joinedAt: string | null;
  isReviewed: boolean;
}

// GET /users/me/reviews 아이템 내 meeting 필드
export interface UserReviewMeetingDTO {
  id: number;
  type: string;
  name: string;
  image: string | null;
  dateTime: string;
}

// GET /users/me/reviews 아이템
export interface UserReviewDTO {
  id: number;
  score: number;
  comment: string;
  meetingId: number;
  meeting: UserReviewMeetingDTO;
  createdAt: string;
}

// GET /meetings/joined 응답
export interface MyMeetingListResponse {
  data: JoinedMeetingDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}

// GET /users/me/reviews 응답
export interface MyReviewListResponse {
  data: UserReviewDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}

// GET /meetings/my 응답
export interface CreatedMeetingListResponse {
  data: MeetingWithHostDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}
