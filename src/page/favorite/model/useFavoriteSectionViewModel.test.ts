import { act, renderHook } from "@testing-library/react";
import { useQueryState } from "nuqs";
import { useFavoriteSectionViewModel } from "./useFavoriteSectionViewModel";

// ViewModel이 의존하는 외부 모듈을 가짜로 대체 (mock)
// → 실제 API 호출, URL 상태, React Query 없이 ViewModel 로직만 테스트 가능

jest.mock("nuqs", () => ({
  parseAsString: { withDefault: () => ({}) },
  useQueryState: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useInfiniteQuery: jest.fn().mockReturnValue({
    data: undefined,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetching: false,
    isLoading: false,
    isError: false,
  }),
}));

jest.mock("@/features/dagym/model/useMeetingTypes", () => ({
  useMeetingTypes: jest.fn().mockReturnValue({ data: [] }),
}));

jest.mock("@/features/favorite/model/useFavorite", () => ({
  useFavorite: jest.fn().mockReturnValue({ toggleFavorite: jest.fn() }),
}));

jest.mock("@/shared/hooks/useInfiniteScroll", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ current: null }),
}));

// 각 테스트 전에 useQueryState 기본값 설정
const setupDefaultQueryState = () => {
  (useQueryState as jest.Mock).mockImplementation((key: string) => {
    const defaults: Record<string, string> = {
      type: "",
      region: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    return [defaults[key] ?? "", jest.fn()];
  });
};

describe("useFavoriteSectionViewModel", () => {
  beforeEach(() => {
    setupDefaultQueryState();
  });

  describe("초기 상태 정합성", () => {
    it("selectedCategory 기본값은 빈 문자열이다", () => {
      const { result } = renderHook(() => useFavoriteSectionViewModel());
      expect(result.current.selectedCategory).toBe("");
    });

    it("sortBy 기본값은 createdAt이다", () => {
      const { result } = renderHook(() => useFavoriteSectionViewModel());
      expect(result.current.sortBy).toBe("createdAt");
    });

    it("sortOrder 기본값은 desc이다", () => {
      const { result } = renderHook(() => useFavoriteSectionViewModel());
      expect(result.current.sortOrder).toBe("desc");
    });

    it("데이터가 없으면 meetings는 빈 배열이다", () => {
      const { result } = renderHook(() => useFavoriteSectionViewModel());
      expect(result.current.meetings).toEqual([]);
    });

    it("tabs의 첫 번째 항목은 전체 탭이다", () => {
      const { result } = renderHook(() => useFavoriteSectionViewModel());
      expect(result.current.tabs[0]).toEqual({ id: 0, name: "전체" });
    });

    it("region이 비어있으면 regionFilter는 전체 옵션이다", () => {
      const { result } = renderHook(() => useFavoriteSectionViewModel());
      expect(result.current.regionFilter).toEqual({ label: "전체", value: "" });
    });

    it("toggleFavorite이 반환된다", () => {
      const { result } = renderHook(() => useFavoriteSectionViewModel());
      expect(result.current.toggleFavorite).toBeDefined();
    });
  });

  describe("이벤트 핸들러", () => {
    it("handleSortChange 호출 시 sortBy와 sortOrder가 각각 업데이트된다", () => {
      const mockSetSortBy = jest.fn();
      const mockSetSortOrder = jest.fn();

      // useQueryState가 호출되는 순서: type → region → sortBy → sortOrder
      (useQueryState as jest.Mock)
        .mockImplementationOnce(() => ["", jest.fn()])
        .mockImplementationOnce(() => ["", jest.fn()])
        .mockImplementationOnce(() => ["createdAt", mockSetSortBy])
        .mockImplementationOnce(() => ["desc", mockSetSortOrder]);

      const { result } = renderHook(() => useFavoriteSectionViewModel());

      act(() => {
        result.current.handleSortChange({
          sortBy: "participantCount",
          sortOrder: "asc",
        });
      });

      expect(mockSetSortBy).toHaveBeenCalledWith("participantCount");
      expect(mockSetSortOrder).toHaveBeenCalledWith("asc");
    });
  });
});
