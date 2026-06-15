"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { fetchJoinedMeetings, type JoinedMeetingsResponse } from "../api";

export const JOINED_MEETINGS_QUERY_KEY = ["joinedDagyms"] as const;

type JoinedMeetingsQueryKey = typeof JOINED_MEETINGS_QUERY_KEY;

export function useJoinedMeetings<TData = JoinedMeetingsResponse>(
  enabled = true,
  options?: Omit<
    UseQueryOptions<JoinedMeetingsResponse, Error, TData, JoinedMeetingsQueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: JOINED_MEETINGS_QUERY_KEY,
    queryFn: fetchJoinedMeetings,
    enabled,
    ...options,
  });
}
