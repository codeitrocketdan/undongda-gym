/**
 * GET /reviews API 응답 타입
 */
export interface Review {
  id: number;
  score: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
  };
  meeting: {
    name: string;
    type: string;
    image: string | null;
  };
}

/**
 * ReviewCard 컴포넌트 props 타입
 */
export interface ReviewCardProps {
  score: number;
  comment: string;
  image: string | null;
  createdAt: string;
  author: {
    name: string;
    image: string | null;
  };
  tags: string[];
}
