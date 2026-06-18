import { act, renderHook } from "@testing-library/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetcher } from "@/shared/api/clientFetcher";
import {
  favoriteQueries,
  meetingQueries,
  userMeetingQueries,
} from "@/shared/lib/queryKeys";
import { useFavorite } from "./useFavorite";

const mockInvalidateQueries = jest.fn();

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

  mockUseQueryClient.mockReturnValue({
    invalidateQueries: mockInvalidateQueries,
  });

  mockUseMutation.mockImplementation(({ mutationFn, onSuccess }) => ({
    mutate: (args: unknown) => {
      mutationFn(args);
      onSuccess?.();
    },
  }));
});

describe("useFavorite", () => {
  describe("toggleFavorite", () => {
    it("isFavorited=true이면 DELETE(찜 취소) 요청을 보낸다", () => {
      const { result } = renderHook(() => useFavorite());

      act(() => result.current.toggleFavorite(1, true));

      expect(clientFetcher.delete).toHaveBeenCalledWith(
        "/api/meetings/1/favorites"
      );
      expect(clientFetcher.post).not.toHaveBeenCalled();
    });

    it("isFavorited=false이면 POST(찜 추가) 요청을 보낸다", () => {
      const { result } = renderHook(() => useFavorite());

      act(() => result.current.toggleFavorite(1, false));

      expect(clientFetcher.post).toHaveBeenCalledWith(
        "/api/meetings/1/favorites"
      );
      expect(clientFetcher.delete).not.toHaveBeenCalled();
    });

    it("성공 시 찜, 다짐, 내 다짐 쿼리를 모두 무효화한다", () => {
      const { result } = renderHook(() => useFavorite());

      act(() => result.current.toggleFavorite(1, false));

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: favoriteQueries.all,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: meetingQueries.all,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: userMeetingQueries.all,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(3);
    });
  });
});
