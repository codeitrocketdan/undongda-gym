"use client";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dagym } from "../model/types";

export const useJoinMutation = (meetingId: string | number) => {
  const queryClient = useQueryClient();

  const queryKey = ["dagym-detail", meetingId];

  return useMutation({
    mutationFn: async (isJoined: boolean) => {
      if (!isJoined) {
        return clientFetcher.post(`/api/meetings/${meetingId}/join`);
      } else {
        return clientFetcher.delete(`/api/meetings/${meetingId}/join`);
      }
    },

    onMutate: async (isJoined: boolean) => {
      await queryClient.cancelQueries({ queryKey });

      const previousDagym = queryClient.getQueryData<Dagym>(queryKey);

      queryClient.setQueryData<Dagym>(queryKey, (old) => {
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
        queryClient.setQueryData(queryKey, context.previousDagym);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["dagym-detail", meetingId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dagym-detail", meetingId, "participants"],
      });
    },
  });
};
