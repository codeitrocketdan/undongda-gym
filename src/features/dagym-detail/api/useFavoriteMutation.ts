import { clientFetcher } from "@/shared/api/clientFetcher";
import {
  decrementFavoritesCount,
  incrementFavoritesCount,
} from "@/shared/hooks/useNewFavoritesCount";
import {
  favoriteQueries,
  meetingQueries,
  userMeetingQueries,
} from "@/shared/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dagym } from "../model/types";
import { dagymQueries } from "./queries";

export function useFavoriteMutation(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFavorited: boolean) => {
      if (isFavorited) {
        return clientFetcher.delete(`/api/meetings/${meetingId}/favorites`);
      }

      return clientFetcher.post(`/api/meetings/${meetingId}/favorites`);
    },

    onMutate: async (isFavorited) => {
      await queryClient.cancelQueries({
        queryKey: dagymQueries.detail(meetingId),
      });

      const previousDetail = queryClient.getQueryData<Dagym>([
        "dagym",
        "detail",
        meetingId,
      ]);

      queryClient.setQueryData<Dagym>(dagymQueries.detail(meetingId), (old) => {
        if (!old) return old;

        return {
          ...old,
          isFavorited: !isFavorited,
        };
      });

      return { previousDetail };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          dagymQueries.detail(meetingId),
          context.previousDetail
        );
      }
    },

    onSuccess: (_data, isFavorited) => {
      if (isFavorited) decrementFavoritesCount();
      else incrementFavoritesCount();
    },

    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dagymQueries.detail(meetingId),
        }),

        queryClient.invalidateQueries({
          queryKey: dagymQueries.suggests(),
        }),

        queryClient.invalidateQueries({ queryKey: favoriteQueries.all }),
        queryClient.invalidateQueries({ queryKey: meetingQueries.all }),
        queryClient.invalidateQueries({ queryKey: userMeetingQueries.all }),
      ]);
    },
  });
}
