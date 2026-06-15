import { clientFetcher } from "@/shared/api/clientFetcher";

interface CreateMeetingRequest {
  type: string;
  name: string;
  region: string;
  address: string;
  addressDetail: string;
  latitude: number;
  longitude: number;
  image: string;
  description: string;
  dateTime: Date;
  registrationEnd: Date;
  capacity: number;
}

export function createMeeting(data: CreateMeetingRequest) {
  return clientFetcher.post("/api/meetings", data);
}
