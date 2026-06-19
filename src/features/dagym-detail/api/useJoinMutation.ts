"use client";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dagym } from "../model/types";
import { dagymQueries } from "./queries";
export const useJoinMutation = (meetingId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isJoined: boolean) => {
      if (!isJoined) {
        return clientFetcher.post(`/api/meetings/${meetingId}/join`);
      } else {
        return clientFetcher.delete(`/api/meetings/${meetingId}/join`);
      }
    },

    onMutate: async (isJoined: boolean) => {
      await queryClient.cancelQueries({
        queryKey: dagymQueries.detail(meetingId),
      });

      const previousDagym = queryClient.getQueryData<Dagym>(
        dagymQueries.detail(meetingId)
      );

      queryClient.setQueryData<Dagym>(dagymQueries.detail(meetingId), (old) => {
        if (!old) return old;
        return {
          ...old,
          isJoined: !isJoined,
          participantCount: !isJoined
            ? old.participantCount + 1
            : Math.max(old.participantCount - 1, 0),
        };
      });

      return { previousDagym };
    },

    onError: (err, variables, context) => {
      console.error("참여 상태 변경 실패:", err);
      if (context?.previousDagym) {
        queryClient.setQueryData(
          dagymQueries.detail(meetingId),
          context.previousDagym
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: dagymQueries.detail(meetingId),
      });

      queryClient.invalidateQueries({
        queryKey: dagymQueries.participants(meetingId),
      });
    },
  });
};
