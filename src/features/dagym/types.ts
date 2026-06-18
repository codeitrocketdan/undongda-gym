// Swagger MeetingType 스키마 1대1 대응 DTO
export interface MeetingTypeDTO {
  id: number;
  teamId: string;
  name: string;
  description: string | null;
  createdAt: string | null;
}

// Swagger Meeting 스키마 1대1 대응 DTO
export interface MeetingDTO {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  dateTime: string | null;
  registrationEnd: string | null;
  capacity: number;
  participantCount: number;
  image: string | null;
  description: string | null;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string | null;
  updatedAt: string | null;
}

// Swagger MeetingWithHost 스키마 1대1 대응 DTO
export interface MeetingWithHostDTO extends MeetingDTO {
  host: { id: number; name: string; image: string | null };
  isFavorited: boolean;
  isJoined: boolean;
  isCompleted: boolean;
}

// GET /{teamId}/meetings 응답
export interface MeetingListResponse {
  data: MeetingWithHostDTO[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
  currentOffset?: number;
  limit?: number;
}

// 다짐 카드 컴포넌트 props
export interface DagymCardProps {
  id: number;
  image: string | null;
  isFavorited: boolean;
  confirmedAt: string | null;
  canceledAt: string | null;
  isJoined: boolean;
  isOwner?: boolean;
  title: string;
  region: string;
  address?: string | null;
  type: string;
  dateTime: string | null;
  registrationEnd: string | null;
  participantCount: number;
  capacity: number;
  onToggleFavorite: () => void;
  onJoin: () => void;
}

// 다짐 상세 카드 컴포넌트 props
export interface DagymDetailCardProps {
  confirmedAt: string | null;
  title: string;
  region: string;
  address?: string | null;
  type: string;
  dateTime: string | null;
  registrationEnd: string | null;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onJoin: () => void;
}

// 추천 다짐 카드 컴포넌트 props
export interface FeatureDagymCardProps {
  id: number;
  image: string | null;
  isFavorited: boolean;
  dateTime: string | null;
  registrationEnd: string | null;
  title: string;
  region: string;
  address?: string | null;
  type: string;
  onToggleFavorite: () => void;
}
