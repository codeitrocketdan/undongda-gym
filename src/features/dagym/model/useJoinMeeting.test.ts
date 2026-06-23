import { act, renderHook } from "@testing-library/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetcher } from "@/shared/api/clientFetcher";
import {
  favoriteQueries,
  meetingQueries,
  userMeetingQueries,
} from "@/shared/lib/queryKeys";
import { useJoinMeeting } from "./useJoinMeeting";

const mockInvalidateQueries = jest.fn();
const mockGetQueriesData = jest.fn(() => []);
const mockSetQueriesData = jest.fn();
const mockSetQueryData = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("@/shared/api/clientFetcher", () => ({
  clientFetcher: {
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockUseQueryClient = useQueryClient as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockGetQueriesData.mockReturnValue([]);

  mockUseQueryClient.mockReturnValue({
    invalidateQueries: mockInvalidateQueries,
    getQueriesData: mockGetQueriesData,
    setQueriesData: mockSetQueriesData,
    setQueryData: mockSetQueryData,
  });

  // 실제 useMutation 흐름(낙관적 업데이트 → 요청 → 정합성 재확인)을 흉내 낸다
  mockUseMutation.mockImplementation(({ mutationFn, onMutate, onSettled }) => ({
    mutate: (args: unknown) => {
      const context = onMutate?.(args);
      mutationFn(args);
      onSettled?.(undefined, null, args, context);
    },
  }));
});

describe("useJoinMeeting", () => {
  describe("toggleJoin", () => {
    it("isJoined=false이면 POST(참가) 요청을 보낸다", () => {
      const { result } = renderHook(() => useJoinMeeting());

      act(() => result.current.toggleJoin(5, false));

      expect(clientFetcher.post).toHaveBeenCalledWith("/api/meetings/5/join");
      expect(clientFetcher.delete).not.toHaveBeenCalled();
    });

    it("isJoined=true이면 DELETE(참가 취소) 요청을 보낸다", () => {
      const { result } = renderHook(() => useJoinMeeting());

      act(() => result.current.toggleJoin(5, true));

      expect(clientFetcher.delete).toHaveBeenCalledWith("/api/meetings/5/join");
      expect(clientFetcher.post).not.toHaveBeenCalled();
    });

    it("성공 시 다짐, 찜, 내 다짐 쿼리를 모두 무효화한다", () => {
      const { result } = renderHook(() => useJoinMeeting());

      act(() => result.current.toggleJoin(5, false));

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: meetingQueries.all,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: favoriteQueries.all,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: userMeetingQueries.all,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(3);
    });

    it("요청 완료를 기다리지 않고 목록 캐시를 즉시 패치한다", () => {
      const { result } = renderHook(() => useJoinMeeting());

      act(() => result.current.toggleJoin(5, false));

      expect(mockSetQueriesData).toHaveBeenCalledWith(
        { queryKey: meetingQueries.all },
        expect.any(Function)
      );
      expect(mockSetQueriesData).toHaveBeenCalledWith(
        { queryKey: favoriteQueries.all },
        expect.any(Function)
      );
      expect(mockSetQueriesData).toHaveBeenCalledWith(
        { queryKey: userMeetingQueries.all },
        expect.any(Function)
      );
    });
  });
});
