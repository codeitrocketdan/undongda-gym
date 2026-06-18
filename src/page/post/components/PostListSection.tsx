"use client";

import PostCard, {
  PostCardSkeleton,
} from "@/features/post/components/PostCard";
import { PostDTO } from "@/features/post/types";
import emptyImage from "@/shared/assets/images/empty.svg";
import { ErrorModal, useModal } from "@/shared/ui/modal";
import Filter from "@/shared/ui/filter/Filter";
import { Pagination } from "@/shared/ui/pagination/Pagination";
import SearchBar from "@/shared/ui/searchBar/SearchBar";
import Image from "next/image";
import {
  POST_SORT_OPTIONS,
  usePostListViewModel,
} from "../model/usePostListViewModel";

export default function PostListSection() {
  const errorModal = useModal();
  const {
    keyword,
    setKeyword,
    sort,
    posts,
    isLoading,
    isError,
    totalPages,
    currentPage,
    pages,
    handleSearch,
    handleSort,
    setCurrentPage,
  } = usePostListViewModel({ onError: errorModal.open });

  return (
    <section className="mt-12 md:mt-16 lg:mt-20">
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
          options={POST_SORT_OPTIONS}
          value={sort}
          onChange={handleSort}
        />
      </div>

      <div className="mb-10 flex flex-col gap-5 rounded-xl bg-white p-6 md:gap-12 md:rounded-2xl lg:p-8">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)
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

      <div className="flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pages={pages}
          hasPrev={currentPage > 1}
          hasNext={currentPage < totalPages}
          goTo={setCurrentPage}
          goPrev={() => setCurrentPage((p) => p - 1)}
          goNext={() => setCurrentPage((p) => p + 1)}
        />
      </div>
      {errorModal.isOpen && <ErrorModal onClose={errorModal.close} />}
    </section>
  );
}
