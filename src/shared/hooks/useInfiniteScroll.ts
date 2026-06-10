import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
  rootMargin?: string;
}

export default function useInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetching,
  rootMargin = "200px",
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching)
          fetchNextPage();
      },
      { rootMargin }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, rootMargin]);

  return observerRef;
}
