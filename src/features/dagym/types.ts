/** Swagger Meeting 스키마 1대1 대응 DTO */
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

/** 클래스 목록 카드 */
export interface DagymCardProps {
  id: number;
  image: string | null;
  isFavorited: boolean;
  confirmedAt: string | null;
  title: string;
  region: string;
  type: string;
  dateTime: string | null;
  registrationEnd: string | null;
  participantCount: number;
  capacity: number;
  onToggleFavorite: () => void;
  onJoin: () => void;
}

/** 클래스 상세 카드 */
export interface DagymDetailCardProps {
  confirmedAt: string | null;
  title: string;
  region: string;
  type: string;
  dateTime: string | null;
  registrationEnd: string | null;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onJoin: () => void;
}

/** 추천 클래스 카드 */
export interface FeatureDagymCardProps {
  id: number;
  image: string | null;
  isFavorited: boolean;
  dateTime: string | null;
  registrationEnd: string | null;
  title: string;
  region: string;
  type: string;
  onToggleFavorite: () => void;
}
