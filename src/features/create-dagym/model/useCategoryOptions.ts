"use client";

import { MeetingTypeDTO } from "@/features/dagym/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { parseMeetingTypeDescription } from "@/shared/lib/meetingTypeDescription";
import { meetingTypeQueries } from "@/shared/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

/* 미팅 타입 목록 중 타입이 community인 카테고리 항목만 가져옴*/
export function useCategoryOptions() {
  const { data: types = [] } = useQuery<MeetingTypeDTO[]>({
    queryKey: meetingTypeQueries.all,
    queryFn: () => clientFetcher.get<MeetingTypeDTO[]>("/api/meeting-types"),
  });

  return types
    .filter(
      (type) =>
        parseMeetingTypeDescription(type.description).category === "community"
    )
    .map((type) => ({
      name: type.name,
      imgUrl: parseMeetingTypeDescription(type.description).imageUrl,
    }));
}
