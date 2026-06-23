"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import { patchMeetingListCaches } from "@/features/dagym/lib/patchMeetingListCaches";
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

  // 목록 캐시(홈/찜/내 다짐)를 즉시 고쳐서 버튼을 누르는 즉시 화면에 반영하고,
  // 서버 응답이 오면 onSettled에서 백그라운드로 정합성을 다시 맞춘다.
  const { mutate: join } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.post<undefined, undefined>(`/api/meetings/${id}/join`),
    onMutate: (id) => ({
      restore: patchMeetingListCaches(queryClient, id, (meeting) => ({
        ...meeting,
        isJoined: true,
        participantCount: meeting.participantCount + 1,
      })),
    }),
    onError: (error, _id, context) => {
      context?.restore();
      onError?.();
    },
    onSettled: invalidateAll,
  });

  const { mutate: cancelJoin } = useMutation({
    mutationFn: (id: number) =>
      clientFetcher.delete(`/api/meetings/${id}/join`),
    onMutate: (id) => ({
      restore: patchMeetingListCaches(queryClient, id, (meeting) => ({
        ...meeting,
        isJoined: false,
        participantCount: Math.max(0, meeting.participantCount - 1),
      })),
    }),
    onError: (error, _id, context) => {
      context?.restore();
      onError?.();
    },
    onSettled: invalidateAll,
  });

  const toggleJoin = (id: number, isJoined: boolean) => {
    if (isJoined) cancelJoin(id);
    else join(id);
  };

  return { toggleJoin };
}
