"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import {
  favoriteQueries,
  meetingQueries,
  userMeetingQueries,
} from "@/shared/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useJoinMeeting({ onError }: { onError?: () => void } = {}) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: meetingQueries.all });
    queryClient.invalidateQueries({ queryKey: favoriteQueries.all });
    queryClient.invalidateQueries({ queryKey: userMeetingQueries.all });
  };

  const { mutate: join } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.post<undefined, undefined>(`/api/meetings/${id}/join`),
    onSuccess: invalidateAll,
    onError,
  });

  const { mutate: cancelJoin } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.delete(`/api/meetings/${id}/join`),
    onSuccess: invalidateAll,
    onError,
  });

  const toggleJoin = (id: number, isJoined: boolean) => {
    if (isJoined) cancelJoin(id);
    else join(id);
  };

  return { toggleJoin };
}
