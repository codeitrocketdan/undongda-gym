/**
 * Swagger ReviewWithDetails 스키마 1대1 대응 DTO
 * GET /{teamId}/reviews 응답 타입
 */
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

/**
 * ReviewCard 컴포넌트 props 타입
 */
export interface ReviewCardProps {
  score: number;
  comment: string;
  image: string | null;
  createdAt: string | null;
  author: {
    name: string;
    image: string | null;
  };
  meetingId: number;
  name: string;
  type: string;
}
