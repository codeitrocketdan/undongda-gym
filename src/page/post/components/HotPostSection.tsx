"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import HotPostCard, {
  HotPostCardSkeleton,
} from "@/features/post/components/HotPostCard";
import { PostDTO, PostListResponse } from "@/features/post/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import emptyImage from "@/shared/assets/images/empty.svg";
import { postQueries } from "@/shared/lib/queryKeys";
import { ErrorModal, useModal } from "@/shared/ui/modal";

export default function HotPostSection() {
  const errorModal = useModal();
  const { data, isLoading, isError } = useQuery<PostListResponse>({
    queryKey: postQueries.hot,
    queryFn: () =>
      clientFetcher.get<PostListResponse>(
        "/api/posts?type=best&offset=0&limit=4"
      ),
  });

  const { open: openErrorModal } = errorModal;
  useEffect(() => {
    if (isError) openErrorModal();
  }, [isError, openErrorModal]);

  const posts = data?.data ?? [];

  return (
    <section className="text-base-semibold md:text-xl-semibold lg:text-2xl-semibold mt-12 md:mt-16 lg:mt-20">
      <p className="mb-3 md:mb-4 lg:mb-5">이번달 HOT 게시글!</p>

      {isLoading ? (
        <div className="flex gap-3 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <HotPostCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-slate-400">불러오는 중 문제가 발생했어요</p>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <Image src={emptyImage} alt="게시글 없음" className="h-24 w-24" />
          <p className="text-sm text-slate-400">아직 HOT 게시글이 없어요</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 md:gap-6">
          {posts.map((post: PostDTO, index: number) => (
            <HotPostCard
              key={post.id}
              id={post.id}
              title={post.title}
              image={post.image}
              likeCount={post.likeCount}
              commentCount={post._count.comments}
              createdAt={post.createdAt}
              priority={index < 2}
            />
          ))}
        </div>
      )}
      {errorModal.isOpen && <ErrorModal onClose={errorModal.close} />}
    </section>
  );
}
