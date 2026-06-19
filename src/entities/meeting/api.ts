import { clientFetcher } from "@/shared/api/clientFetcher";
import type { Dagym } from "./types";

export interface JoinedMeetingsResponse {
  data: Dagym[];
}

export async function fetchJoinedMeetings(): Promise<JoinedMeetingsResponse> {
  return clientFetcher.get<JoinedMeetingsResponse>("/api/users/me/meetings");
}
