import { act, renderHook } from "@testing-library/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetcher } from "@/shared/api/clientFetcher";
import { postQueries } from "@/shared/lib/queryKeys";
import {
  useCreatePost,
  useDeletePost,
  usePostLike,
  useUpdatePost,
} from "./usePostDetail";

const mockInvalidateQueries = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn().mockReturnValue({ data: undefined, isLoading: false, isError: false }),
  useQueryClient: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("@/shared/api/clientFetcher", () => ({
  clientFetcher: {
    get: jest.fn(),
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

describe("usePostLike", () => {
  const postId = "10";

  it("isLiked=true이면 DELETE(좋아요 취소) 요청을 보낸다", () => {
    const { result } = renderHook(() => usePostLike(postId));

    act(() => result.current.mutate({ isLiked: true }));

    expect(clientFetcher.delete).toHaveBeenCalledWith(
      `/api/posts/${postId}/like`
    );
    expect(clientFetcher.post).not.toHaveBeenCalled();
  });

  it("isLiked=false이면 POST(좋아요 추가) 요청을 보낸다", () => {
    const { result } = renderHook(() => usePostLike(postId));

    act(() => result.current.mutate({ isLiked: false }));

    expect(clientFetcher.post).toHaveBeenCalledWith(`/api/posts/${postId}/like`);
    expect(clientFetcher.delete).not.toHaveBeenCalled();
  });

  it("성공 시 게시글 상세 쿼리를 무효화한다", () => {
    const { result } = renderHook(() => usePostLike(postId));

    act(() => result.current.mutate({ isLiked: false }));

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: postQueries.detail(postId),
    });
  });
});

describe("useCreatePost", () => {
  it("성공 시 게시글 목록 쿼리를 무효화한다", () => {
    const { result } = renderHook(() => useCreatePost());

    act(() =>
      result.current.mutate({ title: "제목", content: "<p>내용</p>", image: null })
    );

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: postQueries.all,
    });
  });
});

describe("useUpdatePost", () => {
  const postId = "5";

  it("성공 시 게시글 목록과 인기글 쿼리를 모두 무효화한다", () => {
    const { result } = renderHook(() => useUpdatePost(postId));

    act(() =>
      result.current.mutate({ title: "수정제목", content: "<p>수정내용</p>", image: null })
    );

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: postQueries.all,
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: postQueries.hot,
    });
    expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);
  });
});

describe("useDeletePost", () => {
  it("성공 시 게시글 목록과 인기글 쿼리를 모두 무효화한다", () => {
    const { result } = renderHook(() => useDeletePost());

    act(() => result.current.mutate("3"));

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: postQueries.all,
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: postQueries.hot,
    });
    expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);
  });
});
