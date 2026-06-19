// Swagger ReviewWithDetails 스키마 1대1 대응 DTO
export interface ReviewDTO {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  score: number;
  comment: string;
  createdAt: string | null;
  updatedAt: string | null;
  user: {
    id: number;
    email: string;
    name: string;
    image: string | null;
  };
  meeting: {
    id: number;
    name: string;
    type: string;
    region: string;
    image: string | null;
    dateTime: string | null;
  };
}

// GET /{teamId}/reviews 응답 (커서 기반, totalCount 없음)
export interface ReviewListResponse {
  data: ReviewDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}

// GET /{teamId}/reviews/statistics 응답
export interface ReviewStatsDTO {
  averageScore: number;
  totalReviews: number;
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

// ReviewCard 컴포넌트 props
export interface ReviewCardProps {
  score: number;
  comment: string;
  image: string | null;
  createdAt: string | null;
  author: {
    name: string;
    image: string | null;
  };
  name: string;
  type: string;
}
