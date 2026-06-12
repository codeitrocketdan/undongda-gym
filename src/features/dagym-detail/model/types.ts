interface Host {
  id: number;
  name: string;
  image: string | null;
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
  image: string | null;
  description: string;

  isFavorited: boolean;
  isJoined: boolean;
}
