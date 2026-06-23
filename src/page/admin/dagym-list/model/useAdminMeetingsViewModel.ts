"use client";

import { useMeetingTypes } from "@/features/dagym/model/useMeetingTypes";
import {
  MeetingListResponse,
  MeetingWithHostDTO,
} from "@/features/dagym/types";
import { useUserProfile } from "@/features/my-page/model/useUserProfile";
import { CreatedMeetingListResponse } from "@/features/my-page/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { CENTER_KEYS } from "@/shared/constants/centers";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { parseMeetingTypeDescription } from "@/shared/lib/meetingTypeDescription";
import { meetingQueries, userMeetingQueries } from "@/shared/lib/queryKeys";
import { useModal } from "@/shared/ui/modal/useModal";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";

export type MeetingsTab = "admin" | "user";

export const REGION_FILTER_OPTIONS = [
  { label: "전체", value: "" },
  ...CENTER_KEYS.map((key) => ({ label: `${key}점`, value: key })),
];

export function useAdminMeetingsViewModel() {
  const { data: user } = useUserProfile();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<MeetingsTab>("admin");
  // 고도화 1: 유저의 preferredGym(companyName)이 있으면 초기 지점 필터로 사용, 직접 선택하면 그 값을 우선
  const [manualRegion, setManualRegion] = useState<string | null>(null);
  const preferredGymRegion =
    user?.companyName && CENTER_KEYS.includes(user.companyName)
      ? user.companyName
      : "";
  const region = manualRegion ?? preferredGymRegion;
  const setRegion = setManualRegion;

  const adminQuery = useInfiniteQuery<CreatedMeetingListResponse>({
    queryKey: [...userMeetingQueries.created(), region],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("type", "created");
      if (region) params.set("region", region);
      params.set("size", "10");
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/users/me/meetings?${params}`);
      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "요청에 실패했습니다." }));
        throw new Error(error.message ?? "요청에 실패했습니다.");
      }
      return (await res.json()) as CreatedMeetingListResponse;
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: null,
    enabled: tab === "admin",
  });

  const userQuery = useInfiniteQuery<MeetingListResponse>({
    queryKey: meetingQueries.list({ region }),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (region) params.set("region", region);
      params.set("size", "10");
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/meetings?${params}`);
      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "요청에 실패했습니다." }));
        throw new Error(error.message ?? "요청에 실패했습니다.");
      }
      return (await res.json()) as MeetingListResponse;
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: null,
    enabled: tab === "user",
  });

  const activeQuery = tab === "admin" ? adminQuery : userQuery;

  const { data: meetingTypes = [] } = useMeetingTypes();

  // 관리자 모임 탭 = regular 타입만, 유저 모임 탭 = community 타입만
  const allowedTypeNames = useMemo(
    () =>
      new Set(
        meetingTypes
          .filter(
            (meetingType) =>
              parseMeetingTypeDescription(meetingType.description).category ===
              (tab === "admin" ? "regular" : "community")
          )
          .map((meetingType) => meetingType.name)
      ),
    [meetingTypes, tab]
  );

  const meetings: MeetingWithHostDTO[] = useMemo(
    () =>
      (activeQuery.data?.pages.flatMap((page) => page.data ?? []) ?? [])
        .filter((meeting) => allowedTypeNames.has(meeting.type))
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        ),
    [activeQuery.data, allowedTypeNames]
  );

  const observerRef = useInfiniteScroll({
    fetchNextPage: activeQuery.fetchNextPage,
    hasNextPage: !!activeQuery.hasNextPage,
    isFetching: activeQuery.isFetching,
  });

  const detailModal = useModal();
  const [selectedMeeting, setSelectedMeeting] =
    useState<MeetingWithHostDTO | null>(null);
  const handleRowClick = (meeting: MeetingWithHostDTO) => {
    setSelectedMeeting(meeting);
    detailModal.open();
  };

  const editModal = useModal();
  const [editingMeeting, setEditingMeeting] =
    useState<MeetingWithHostDTO | null>(null);
  const handleEdit = (meeting: MeetingWithHostDTO) => {
    setEditingMeeting(meeting);
    editModal.open();
  };
  const handleCloseEditModal = () => {
    editModal.close();
    setEditingMeeting(null);
  };

  const deleteModal = useModal();
  const [deletingMeeting, setDeletingMeeting] =
    useState<MeetingWithHostDTO | null>(null);
  const handleOpenDeleteModal = (meeting: MeetingWithHostDTO) => {
    setDeletingMeeting(meeting);
    deleteModal.open();
  };
  const invalidateMeetingLists = () => {
    queryClient.invalidateQueries({ queryKey: meetingQueries.all });
    queryClient.invalidateQueries({ queryKey: userMeetingQueries.all });
  };
  const { mutate: deleteMeeting, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => clientFetcher.delete(`/api/meetings/${id}`),
    onSuccess: () => {
      invalidateMeetingLists();
      deleteModal.close();
      setDeletingMeeting(null);
    },
  });
  const handleConfirmDelete = () => {
    if (!deletingMeeting) return;
    deleteMeeting(deletingMeeting.id);
  };

  const [sharedMeetingId, setSharedMeetingId] = useState<number | null>(null);
  const handleShare = async (meeting: MeetingWithHostDTO) => {
    const url = `${window.location.origin}/dagym-detail/${meeting.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setSharedMeetingId(meeting.id);
      setTimeout(
        () => setSharedMeetingId((prev) => (prev === meeting.id ? null : prev)),
        2000
      );
      alert("링크가 클립보드에 복사되었습니다.");
    } catch {
      alert("링크 복사에 실패했습니다. 주소창의 링크를 복사해주세요.");
    }
  };

  return {
    tab,
    setTab,
    region,
    setRegion,
    regionOptions: REGION_FILTER_OPTIONS,
    meetings,
    isLoading: activeQuery.isLoading,
    isEmpty: !activeQuery.isLoading && meetings.length === 0,
    observerRef,
    detailModal,
    selectedMeeting,
    handleRowClick,
    editModal,
    editingMeeting,
    handleEdit,
    handleCloseEditModal,
    deleteModal,
    deletingMeeting,
    isDeleting,
    handleOpenDeleteModal,
    handleConfirmDelete,
    sharedMeetingId,
    handleShare,
  };
}
