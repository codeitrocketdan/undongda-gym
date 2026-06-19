import { clientFetcher } from "@/shared/api/clientFetcher";
import { postQueries } from "@/shared/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { useCommentActions } from "./useCommentActions";

const mockInvalidateQueries = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("@/shared/api/clientFetcher", () => ({
  clientFetcher: {
    post: jest.fn(),
    patch: jest.fn(),
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

describe("useCommentActions", () => {
  const postId = "42";

  describe("submit (댓글 작성)", () => {
    it("올바른 API 경로로 POST 요청을 보낸다", () => {
      const { result } = renderHook(() => useCommentActions(postId));

      act(() => result.current.submit.mutate("좋은 글이에요"));

      expect(clientFetcher.post).toHaveBeenCalledWith(
        `/api/posts/${postId}/comments`,
        { content: "좋은 글이에요" }
      );
    });

    it("성공 시 해당 게시글 상세 쿼리를 무효화한다", () => {
      const { result } = renderHook(() => useCommentActions(postId));

      act(() => result.current.submit.mutate("좋은 글이에요"));

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: postQueries.detail(postId),
      });
    });
  });

  describe("edit (댓글 수정)", () => {
    it("올바른 API 경로로 PATCH 요청을 보낸다", () => {
      const { result } = renderHook(() => useCommentActions(postId));

      act(() => result.current.edit.mutate({ id: 7, content: "수정했어요" }));

      expect(clientFetcher.patch).toHaveBeenCalledWith(
        `/api/posts/${postId}/comments/7`,
        { content: "수정했어요" }
      );
    });

    it("성공 시 해당 게시글 상세 쿼리를 무효화한다", () => {
      const { result } = renderHook(() => useCommentActions(postId));

      act(() => result.current.edit.mutate({ id: 7, content: "수정했어요" }));

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: postQueries.detail(postId),
      });
    });
  });

  describe("remove (댓글 삭제)", () => {
    it("올바른 API 경로로 DELETE 요청을 보낸다", () => {
      const { result } = renderHook(() => useCommentActions(postId));

      act(() => result.current.remove.mutate(7));

      expect(clientFetcher.delete).toHaveBeenCalledWith(
        `/api/posts/${postId}/comments/7`
      );
    });

    it("성공 시 해당 게시글 상세 쿼리를 무효화한다", () => {
      const { result } = renderHook(() => useCommentActions(postId));

      act(() => result.current.remove.mutate(7));

      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: postQueries.detail(postId),
      });
    });
  });
});
