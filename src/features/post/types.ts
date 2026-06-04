// Swagger PostWithAuthor 스키마 1대1 대응 DTO
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

// GET /{teamId}/posts 응답
export interface PostListResponse {
  data: PostDTO[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
  currentOffset?: number;
  limit?: number;
  totalViewCount?: number;
}

// PostCard 컴포넌트 props
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

// HotPostCard 컴포넌트 props
export interface HotPostCardProps {
  id: number;
  title: string;
  image: string | null;
  likeCount: number;
  createdAt: string | null;
  commentCount: number;
}
