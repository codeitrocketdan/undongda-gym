import PostCard, {
  PostCardSkeleton,
} from "@/features/post/components/PostCard";
import { PostDTO, PostListResponse } from "@/features/post/types";
import emptyImage from "@/shared/assets/images/empty.svg";
import Filter from "@/shared/ui/filter/Filter";
import { SortOption } from "@/shared/ui/filter/SortFilter";
import { Pagination } from "@/shared/ui/pagination/Pagination";
import SearchBar from "@/shared/ui/searchBar/SearchBar";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

const LIMIT = 5;

const SORT_OPTIONS: SortOption[] = [
  { label: "최신순", value: "createdAt:desc" },
  { label: "오래된순", value: "createdAt:asc" },
  { label: "조회수순", value: "viewCount:desc" },
  { label: "좋아요순", value: "likeCount:desc" },
  { label: "댓글 많은 순", value: "commentCount:desc" },
];

export default function PostListSection() {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [sortBy, sortOrder] = sort.value.split(":");
  const offset = (currentPage - 1) * LIMIT;

  const { data, isLoading, isError } = useQuery<PostListResponse>({
    queryKey: ["posts", search, sort.value, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(LIMIT),
        sortBy,
        sortOrder,
        ...(search && { keyword: search }),
      });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?${params}`
      );
      return res.json();
    },
  });

  const posts = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const handleSearch = () => {
    setSearch(keyword);
    setCurrentPage(1);
  };

  const handleSort = (option: SortOption) => {
    setSort(option);
    setCurrentPage(1);
  };

  return (
    <section className="mt-12 md:mt-16 lg:mt-20">
      {/* 검색 + 정렬 */}
      <div className="mb-4 flex items-center justify-between gap-2.5">
        <div className="w-96">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
            placeholder="제목 또는 내용을 입력해주세요."
          />
        </div>
        <Filter.Sort
          options={SORT_OPTIONS}
          value={sort}
          onChange={handleSort}
        />
      </div>

      {/* 게시글 목록 */}
      <div className="mb-10 flex flex-col gap-5 rounded-xl bg-white p-6 md:gap-12 md:rounded-2xl lg:p-8">
        {isLoading ? (
          Array.from({ length: LIMIT }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))
        ) : isError ? (
          <p className="py-10 text-center text-sm text-slate-400">
            불러오는 중 문제가 발생했어요
          </p>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Image src={emptyImage} alt="게시글 없음" className="h-24 w-24" />
            <p className="text-sm text-slate-400">게시글이 없어요</p>
          </div>
        ) : (
          posts.map((post: PostDTO) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              image={post.image}
              likeCount={post.likeCount}
              commentCount={post._count.comments}
              createdAt={post.createdAt}
              author={post.author}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pages={pages}
          hasPrev={currentPage > 1}
          hasNext={currentPage < totalPages}
          goTo={(page) => setCurrentPage(page)}
          goPrev={() => setCurrentPage((p) => p - 1)}
          goNext={() => setCurrentPage((p) => p + 1)}
        />
      </div>
    </section>
  );
}
