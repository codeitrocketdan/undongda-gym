import { act, renderHook } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { POST_SORT_OPTIONS, usePostListViewModel } from "./usePostListViewModel";

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn().mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
}));

jest.mock("@/shared/api/clientFetcher", () => ({
  clientFetcher: { get: jest.fn() },
}));

const mockUseQuery = useQuery as jest.Mock;

describe("usePostListViewModel", () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
  });

  describe("초기 상태", () => {
    it("keyword 기본값은 빈 문자열이다", () => {
      const { result } = renderHook(() => usePostListViewModel());
      expect(result.current.keyword).toBe("");
    });

    it("currentPage 기본값은 1이다", () => {
      const { result } = renderHook(() => usePostListViewModel());
      expect(result.current.currentPage).toBe(1);
    });

    it("sort 기본값은 최신순이다", () => {
      const { result } = renderHook(() => usePostListViewModel());
      expect(result.current.sort).toEqual(POST_SORT_OPTIONS[0]);
    });

    it("데이터가 없으면 posts는 빈 배열이다", () => {
      const { result } = renderHook(() => usePostListViewModel());
      expect(result.current.posts).toEqual([]);
    });

    it("데이터가 없으면 totalPages는 0이다", () => {
      const { result } = renderHook(() => usePostListViewModel());
      expect(result.current.totalPages).toBe(0);
    });
  });

  describe("handleSearch", () => {
    it("handleSearch 호출 시 currentPage가 1로 리셋된다", () => {
      const { result } = renderHook(() => usePostListViewModel());

      act(() => result.current.setCurrentPage(5));
      expect(result.current.currentPage).toBe(5);

      act(() => result.current.handleSearch());
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("handleSort", () => {
    it("handleSort 호출 시 sort가 선택한 옵션으로 변경된다", () => {
      const { result } = renderHook(() => usePostListViewModel());

      act(() => result.current.handleSort(POST_SORT_OPTIONS[2]));

      expect(result.current.sort).toEqual(POST_SORT_OPTIONS[2]);
    });

    it("handleSort 호출 시 currentPage가 1로 리셋된다", () => {
      const { result } = renderHook(() => usePostListViewModel());

      act(() => result.current.setCurrentPage(4));
      act(() => result.current.handleSort(POST_SORT_OPTIONS[1]));

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe("pages 계산 (LIMIT = 5, 최대 5페이지 표시)", () => {
    it("currentPage=1, totalCount=25(5페이지)이면 pages는 [1,2,3,4,5]이다", () => {
      mockUseQuery.mockReturnValue({
        data: { data: [], totalCount: 25 },
        isLoading: false,
        isError: false,
      });

      const { result } = renderHook(() => usePostListViewModel());
      expect(result.current.pages).toEqual([1, 2, 3, 4, 5]);
    });

    it("currentPage=7, totalPages=10이면 pages는 [5,6,7,8,9]이다", () => {
      mockUseQuery.mockReturnValue({
        data: { data: [], totalCount: 50 },
        isLoading: false,
        isError: false,
      });

      const { result } = renderHook(() => usePostListViewModel());

      act(() => result.current.setCurrentPage(7));
      // start = max(1, 7-2) = 5, end = min(10, 5+4) = 9
      expect(result.current.pages).toEqual([5, 6, 7, 8, 9]);
    });

    it("totalCount=12(3페이지)이면 마지막 페이지에서 pages는 [1,2,3]이다", () => {
      mockUseQuery.mockReturnValue({
        data: { data: [], totalCount: 12 },
        isLoading: false,
        isError: false,
      });

      const { result } = renderHook(() => usePostListViewModel());
      // start = max(1, 1-2) = 1, end = min(3, 1+4) = 3
      expect(result.current.pages).toEqual([1, 2, 3]);
    });

    it("totalCount=0이면 pages는 빈 배열이다", () => {
      const { result } = renderHook(() => usePostListViewModel());
      expect(result.current.pages).toEqual([]);
    });
  });
});
