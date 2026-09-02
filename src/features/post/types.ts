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

// GET /{teamId}/posts/{postId} 응답 (PostWithComments)
export interface PostDetailDTO {
  id: number;
  teamId: string;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  author: {
    id: number;
    name: string;
    image: string | null;
    email: string;
  };
  comments: CommentDTO[];
}

// Comment 스키마 1대1 대응 DTO
export interface CommentDTO {
  id: number;
  teamId: string;
  postId: number;
  authorId: number;
  author: {
    id: number;
    name: string;
    image: string | null;
  };
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

// HotPostCard 컴포넌트 props
export interface HotPostCardProps {
  id: number;
  title: string;
  image: string | null;
  likeCount: number;
  createdAt: string | null;
  commentCount: number;
  priority?: boolean;
}
