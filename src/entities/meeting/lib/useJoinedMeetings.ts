"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import {
  fetchJoinedMeetings,
  JOINED_MEETINGS_QUERY_KEY,
  type JoinedMeetingsResponse,
} from "../api";

export { JOINED_MEETINGS_QUERY_KEY };

type JoinedMeetingsQueryKey = typeof JOINED_MEETINGS_QUERY_KEY;

export function useJoinedMeetings<TData = JoinedMeetingsResponse>(
  enabled = true,
  options?: Omit<
    UseQueryOptions<
      JoinedMeetingsResponse,
      Error,
      TData,
      JoinedMeetingsQueryKey
    >,
    "queryKey" | "queryFn" | "enabled"
  >
) {
  return useQuery({
    queryKey: JOINED_MEETINGS_QUERY_KEY,
    queryFn: fetchJoinedMeetings,
    enabled,
    ...options,
  });
}
