"use client";

import HotPostCard from "@/features/post/components/HotPostCard";
import { PostDTO, PostListResponse } from "@/features/post/types";
import { useInView } from "@/shared/hooks/useInView";
import { useQuery } from "@tanstack/react-query";

export default function LandingCommunity() {
  const { ref, isInView } = useInView();
  const { data, isLoading } = useQuery<PostListResponse>({
    queryKey: ["hot-posts-landing"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?type=best&offset=0&limit=4`
      );
      return res.json();
    },
  });

  const posts = data?.data ?? [];

  return (
    <section
      ref={ref}
      className={`mx-auto max-w-7xl px-6 py-16 md:py-26 ${
        isInView ? "animate-fadeInUp" : "opacity-0"
      }`}
    >
      <div className="flex flex-col gap-8 md:gap-12">
        <div className="text-center">
          <span className="text-sm-bold mb-2 inline-block text-blue-600">
            다짐토크
          </span>
          <h2 className="text-2xl-bold md:text-3xl-bold mb-2 text-gray-900 md:mb-3">
            다른사람의 다양한 이야기를 들어보세요.
          </h2>
          <p className="text-sm-regular md:text-lg-regular text-gray-600">
            운동 인증부터 동기부여까지 자유로운 주제로 이야기해요.
          </p>
        </div>

        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2 md:gap-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 md:gap-3 xl:grid-cols-4">
              {posts.map((post: PostDTO) => (
                <div key={post.id} className="flex justify-center">
                  <HotPostCard
                    id={post.id}
                    title={post.title}
                    image={post.image}
                    likeCount={post.likeCount}
                    commentCount={post._count.comments}
                    createdAt={post.createdAt}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
