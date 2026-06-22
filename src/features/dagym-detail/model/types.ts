interface Host {
  id: number;
  name: string;
  image: string | null;
}

export interface ParticipantUser {
  id: number;
  name: string;
  image: string | null;
}

export interface Participant {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  joinedAt: string;
  user: ParticipantUser;
}

export interface ParticipantsResponse {
  data: Participant[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface Dagym {
  id: number;
  teamId: string;
  type: string;

  participantCount: number;
  canceledAt: string | null;
  confirmedAt: string | null;

  hostId: number;
  createdBy: number;

  createdAt: string;
  updatedAt: string;

  host: Host;

  isCompleted: boolean;
  name: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;

  dateTime: string;
  registrationEnd: string;

  capacity: number;
  image: string;
  description: string;

  isFavorited: boolean;
  isJoined: boolean;
}

export interface DagymUpdateForm {
  name: string;
  type: string;
  region: string;
  address: string;
  addressDetail: string;
  latitude: number;
  longitude: number;
  image: string;
  capacity: number;
  dateTime: string;
  registrationEnd: string;
  description: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  image: string | null;
}

export interface Meeting {
  id: number;
  name: string;
  type: string;
  region: string;
  image: string;
  dateTime: string;
}

export interface Review {
  id: number;
  teamId: string;
  meetingId: number;
  userId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  meeting: Meeting;
}

export interface ReviewsResponse {
  data: Review[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface Meeting {
  id: number;
  teamId: string;
  name: string;
  type: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
  participantCount: number;
  image: string;
  description: string;
  canceledAt: string | null;
  confirmedAt: string | null;
  hostId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  host: {
    id: number;
    name: string;
    image: string;
  };
  isFavorited: boolean;
  isJoined: boolean;
  isCompleted: boolean;
}

export interface MeetingListResponse {
  data: Meeting[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  currentOffset: number;
  limit: number;
}
