/**
 * Swagger Post 스키마 1대1 대응 DTO
 * GET /{teamId}/posts 응답 타입
 */
export interface PostDTO {
  id: number;
  teamId: string;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  viewCount: number;
  likeCount: number;
  createdAt: string | null;
  updatedAt: string | null;
  author: {
    id: number;
    name: string;
    image: string | null;
  };
  _count: {
    comments: number;
  };
}

/**
 * PostCard 컴포넌트에 필요한 타입
 */
export interface PostCardProps {
  id: number;
  title: string;
  content: string;
  image: string | null;
  likeCount: number;
  createdAt: string | null;
  author: {
    name: string;
    image: string | null;
  };
  commentCount: number;
}

/**
 * HotPostCard 컴포넌트에 필요한 타입
 */
export interface HotPostCardProps {
  id: number;
  title: string;
  image: string | null;
  likeCount: number;
  createdAt: string | null;
  commentCount: number;
}
