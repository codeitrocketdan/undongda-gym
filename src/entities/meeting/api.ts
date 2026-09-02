import { clientFetcher } from "@/shared/api/clientFetcher";
import type { Dagym } from "./types";

export interface JoinedMeetingsResponse {
  data: Dagym[];
}

// "use client" 파일이 아닌 여기 둬서 서버 컴포넌트에서도 값 그대로 import할 수 있게 한다.
// useJoinedMeetings.ts(use client)에 있으면 서버 컴포넌트에서 import 시 실제 배열이 아닌
// client reference로 대체돼 react-query가 "queryKey needs to be an Array" 에러를 던진다.
export const JOINED_MEETINGS_QUERY_KEY = ["joinedDagyms"] as const;

export async function fetchJoinedMeetings(): Promise<JoinedMeetingsResponse> {
  return clientFetcher.get<JoinedMeetingsResponse>("/api/users/me/meetings");
}
