/**
 *  GET /posts API 응답 타입
 */
export interface Post {
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
  author: {
    name: string;
    image: string | null;
    createdAt: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
}
