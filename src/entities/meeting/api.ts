import type { Dagym } from "./types";

export interface JoinedMeetingsResponse {
  data: Dagym[];
}

export async function fetchJoinedMeetings(): Promise<JoinedMeetingsResponse> {
  const response = await fetch("/api/users/me/meetings");
  if (!response.ok) throw new Error(`서버 에러 상태코드: ${response.status}`);
  return response.json();
}
